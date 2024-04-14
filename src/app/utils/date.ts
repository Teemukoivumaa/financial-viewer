function resetTimeToZero(dateString: string): string {
  const date = new Date(dateString); // Create a new Date object from the input date string
  date.setUTCHours(0); // Set hours to 0 in UTC time zone
  date.setUTCMinutes(0); // Set minutes to 0 in UTC time zone
  date.setUTCSeconds(0); // Set seconds to 0 in UTC time zone
  date.setUTCMilliseconds(0); // Set milliseconds to 0 in UTC time zone
  return date.toISOString(); // Return the modified date in ISO format
}

export function generateTodaysDate(): string {
  const today = new Date(); // Get today's date
  const resetDate = resetTimeToZero(today.toISOString()); // Reset the time to zero

  return resetDate;
}

export function isToday(dateString: string): boolean {
  const today = new Date(); // Get today's date
  const date = new Date(dateString); // Convert the given date string to a Date object

  // Check if the year, month, and day of the two dates are the same
  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
}