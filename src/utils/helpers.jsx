export const cleanRequestParams = (request) => {
  return Object.keys(request).reduce((acc, key) => {
    const value = request[key];
    if (value !== null && value !== "" && value !== "ALL") {
      acc[key] = value;
    }
    return acc;
  }, {});
};
