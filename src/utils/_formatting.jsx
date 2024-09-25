const formatDate = (date) => {
  if (date instanceof Date) {
    return date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
  }
  return "";
};

export default { formatDate };