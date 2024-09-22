export function convertTimestampToDate(timestamp: string): string {
  // Convert the string timestamp to a number
  const date = new Date(parseInt(timestamp));

  // Format the date to a readable string
  const formattedDate = date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return formattedDate;
}