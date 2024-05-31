export const formatDate = (dateString) => {
  // Parse the date string properly to avoid errors
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  const options = { year: "numeric", month: "short", day: "2-digit" };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};
