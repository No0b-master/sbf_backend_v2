export function validUtp(session) {
  // Split the session string by "-"
  const parts = session.split('-');
  if (parts.length !== 2) {
    throw new Error("Invalid session format. Expected format: 'YYYY-YYYY'");
  }

  // Get the second year part and parse it
  const endYear = parseInt(parts[1]);
  if (isNaN(endYear)) {
    throw new Error("Invalid year in session string.");
  }

  // Add 1 to get the next financial year's start date
  const validUptoYear = endYear + 1;

  // Return the date in YYYY-MM-DD format
  return `${validUptoYear}-04-01`;
}
