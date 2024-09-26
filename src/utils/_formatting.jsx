const formatDate = (date) => {
  if (date instanceof Date) {
    return date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
  }
  return "";
};
const formatString = (str) => {
  if (str !== null)
    return str
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  return "";
};

export { formatDate, formatString };
