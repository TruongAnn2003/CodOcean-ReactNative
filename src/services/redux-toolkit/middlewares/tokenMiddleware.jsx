import { refreshAccessToken, signOut } from '../reducers/authSlice';
import { setError } from "../reducers/errorSlice";
import { getTokens, saveTokens, isTokenExpired } from '../../../utils/tokenUtils';
import { axiosInstance } from '../../api/api';

let isRefreshing = false;
let refreshSubscribers = [];

function addSubscriber(callback) {
  refreshSubscribers.push(callback);
}

const tokenMiddleware = (storeAPI) => (next) => async (action) => {
  // Proceed with the action
  const result = next(action);
  const { accessToken, refreshToken } = await getTokens();

  if (action.type.endsWith('/pending') && action.type.includes('/request-auth')) {
    // if (refreshToken && isTokenExpired(refreshToken)) {
    //   await storeAPI.dispatch(signOut());
    //   return result;
    // }

    if (accessToken && isTokenExpired(accessToken)) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const resultAction = await storeAPI.dispatch(refreshAccessToken());
          if (refreshAccessToken.fulfilled.match(resultAction)) {
            const newAccessToken = resultAction.payload.accessToken;
            await saveTokens(newAccessToken, refreshToken);
          } else {
            await storeAPI.dispatch(setError('Failed to refresh token'));
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          await storeAPI.dispatch(setError('Failed to refresh token'));
          // await storeAPI.dispatch(signOut());
        } finally {
          isRefreshing = false;
        }
      }

      // Return a promise that resolves once the token is refreshed
      return new Promise((resolve) => {
        addSubscriber((newToken) => {
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          resolve(next(action)); // Retry the original action with the new token
        });
      });
    }
  }

  return result;
};

export default tokenMiddleware;
