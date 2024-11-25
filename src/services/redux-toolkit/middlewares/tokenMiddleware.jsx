import { refreshAccessToken, signOut } from '../reducers/authSlice';
import { setError } from "../reducers/messageSlice";
import { getTokens, saveTokens, isTokenExpired } from '../../../utils/tokenUtils';
import { axiosInstance } from '../../api/api';


let isRefreshing = false;
let refreshSubscribers = [];

function addSubscriber(callback) {
  refreshSubscribers.push(callback);
}

function notifySubscribers(newToken) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

const tokenMiddleware = (storeAPI) => (next) => async (action) => {
  const { accessToken, refreshToken } = await getTokens();

  if (action.type && action.type.includes("/request-auth")) {
    if (refreshToken && isTokenExpired(refreshToken)) {
      await storeAPI.dispatch(signOut());
      await removeTokens();
      window.location.href = "/auth/sign-in";
      return;
    }

    if (accessToken && isTokenExpired(accessToken)) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const resultAction = await storeAPI.dispatch(refreshAccessToken());
          if (refreshAccessToken.fulfilled.match(resultAction)) {
            const newAccessToken = resultAction.payload.accessToken;
            await saveTokens(newAccessToken, refreshToken);
            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            notifySubscribers(newAccessToken);
          } else {
            await storeAPI.dispatch(setError("Failed to refresh token"));
            notifySubscribers(null);
          }
        } catch (e) {
          await storeAPI.dispatch(
            setError(`Failed to refresh token: ${e.message}`)
          );
          notifySubscribers(null);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        addSubscriber((newToken) => {
          if (newToken) {
            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newToken}`;
            resolve(next(action));
          } else {
            reject(new Error("Token refresh failed"));
          }
        });
      });
    }
  }

  return next(action);
};

export default tokenMiddleware;