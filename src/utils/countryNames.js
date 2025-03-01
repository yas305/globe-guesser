// src/utils/countryNames.js

// Map of common names to official names
const nameMapping = {
    // Republic variations
    "Laos": "Lao People's Democratic Republic",
    "North Korea": "Democratic People's Republic of Korea",
    "South Korea": "Republic of Korea",
    "DR Congo": "Democratic Republic of the Congo",
    "Congo": "Democratic Republic of the Congo",
    "Czech Republic": "Czechia",
    "Libya": "Libyan Arab Jamahiriya",
    "Macedonia": "The former Yugoslav Republic of Macedonia",
    "Iran": "Iran (Islamic Republic of)",
    "Syria": "Syrian Arab Republic",
    "Moldova": "Moldova, Republic of",
    "Russia": "Russian Federation",
    "Tanzania": "United Republic of Tanzania",
    
    // Countries with other variations
    "UK": "U.K. of Great Britain and Northern Ireland",
    "Britain": "U.K. of Great Britain and Northern Ireland",
    "United Kingdom": "U.K. of Great Britain and Northern Ireland",
    "USA": "United States of America",
    "US": "United States of America",
    "UAE": "United Arab Emirates",
    "East Timor": "Timor-Leste",
    "Burma": "Myanmar",
    "Brunei": "Brunei Darussalam",
    "Ivory Coast": "Côte d'Ivoire",
    "Bosnia": "Bosnia & Herzegovina"
  };
  
  // Get official name for any input
  export const getOfficialName = (name) => {
    if (!name) return null;
    return nameMapping[name] || name;
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
    const normalized = name.toLowerCase()
      .replace(/[&]/g, 'and')
      .replace(/[']/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    return getOfficialName(normalized) || normalized;
  };
  
  // Function to check if two country names refer to the same country
  export const isSameCountry = (name1, name2) => {
    const official1 = getOfficialName(name1);
    const official2 = getOfficialName(name2);
    return official1 === official2;
  };