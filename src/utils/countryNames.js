// src/utils/countryNames.js

// Map of common names to official names
const nameMapping = {
  // Republic variations
  "Laos": "Lao People's Democratic Republic",
  "North Korea": "Democratic People's Republic of Korea",
  "South Korea": "Republic of Korea",
  "DR Congo": "Democratic Republic of the Congo",
  "Congo": "Democratic Republic of the Congo",
  "DRC": "Democratic Republic of the Congo",
  "Czech Republic": "Czechia",
  "Libya": "Libyan Arab Jamahiriya",
  "Macedonia": "The former Yugoslav Republic of Macedonia",
  "North Macedonia": "The former Yugoslav Republic of Macedonia",
  "FYROM": "The former Yugoslav Republic of Macedonia",
  "Iran": "Iran (Islamic Republic of)",
  "Persia": "Iran (Islamic Republic of)",
  "Syria": "Syrian Arab Republic",
  "Moldova": "Moldova, Republic of",
  "Russia": "Russian Federation",
  "Tanzania": "United Republic of Tanzania",

  // Countries with other variations
  "UK": "U.K. of Great Britain and Northern Ireland",
  "Britain": "U.K. of Great Britain and Northern Ireland",
  "Great Britain": "U.K. of Great Britain and Northern Ireland",
  "England": "U.K. of Great Britain and Northern Ireland",
  "United Kingdom": "U.K. of Great Britain and Northern Ireland",
  "USA": "United States of America",
  "US": "United States of America",
  "United States": "United States of America",
  "America": "United States of America",
  "UAE": "United Arab Emirates",
  "East Timor": "Timor-Leste",
  "Burma": "Myanmar",
  "Brunei": "Brunei Darussalam",
  "Ivory Coast": "Côte d'Ivoire",
  "Bosnia": "Bosnia & Herzegovina",
  "Bosnia and Herzegovina": "Bosnia & Herzegovina",
  "Swaziland": "Eswatini",
  "Turkey": "Türkiye",
  "Vatican": "Holy See",
  "Vatican City": "Holy See",
  "Palestine": "State of Palestine",
  "Taiwan": "Chinese Taipei"
};

// Get official name for any input
export const getOfficialName = (name) => {
  if (!name) return null;

  // First try direct lookup
  if (nameMapping[name]) return nameMapping[name];

  // Then try case-insensitive lookup
  const lowerName = name.toLowerCase();
  const match = Object.keys(nameMapping).find(key => key.toLowerCase() === lowerName);
  if (match) return nameMapping[match];

  // Return original if no match found
  return name;
};

// Get common name for official name
export const getCommonName = (officialName) => {
  // Find the first common name that maps to this official name
  const entry = Object.entries(nameMapping).find(([_, official]) => official === officialName);
  return entry ? entry[0] : officialName;
};

// Function to normalize a name for comparison
export const normalizeCountryName = (name) => {
  if (!name) return '';

  // Normalize the input string
  const normalized = name.toLowerCase()
    .replace(/[&]/g, 'and')
    .replace(/[']/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\(.*\)/g, '') // Remove parenthetical content
    .replace(/republic\s+of\s+/i, '') // Remove "Republic of" prefix
    .replace(/democratic\s+/i, '') // Remove "Democratic" prefix
    .replace(/people'?s\s+/i, '') // Remove "People's" prefix
    .trim();

  // Try to get the official name
  return getOfficialName(normalized) || normalized;
};

// Function to check if two country names refer to the same country
export const isSameCountry = (name1, name2) => {
  if (!name1 || !name2) return false;

  const official1 = getOfficialName(name1);
  const official2 = getOfficialName(name2);

  // Direct match of official names
  if (official1 === official2) return true;

  // Normalize both names for fuzzy matching
  const norm1 = normalizeCountryName(name1);
  const norm2 = normalizeCountryName(name2);

  return norm1 === norm2;
};