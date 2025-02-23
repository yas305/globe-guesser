// src/utils/countryNameMapper.js

// Map of common names to official names
const countryNameMapping = {
    // Democratic/Republic names
    "Laos": "Lao People's Democratic Republic",
    "North Korea": "Democratic People's Republic of Korea",
    "South Korea": "Republic of Korea",
    "Congo": "Democratic Republic of the Congo",
    "DR Congo": "Democratic Republic of the Congo",
    "Czech Republic": "Czech Republic",
    "Czech": "Czech Republic",
    "Czechia": "Czech Republic",
    "Libya": "Libyan Arab Jamahiriya",
    "Macedonia": "The former Yugoslav Republic of Macedonia",
    "Iran": "Iran (Islamic Republic of)",
    "Syria": "Syrian Arab Republic",
    "UK": "U.K. of Great Britain and Northern Ireland",
    "Britain": "U.K. of Great Britain and Northern Ireland",
    "United Kingdom": "U.K. of Great Britain and Northern Ireland",
    "Moldova": "Moldova, Republic of",
    "Tanzania": "United Republic of Tanzania",
    "Vietnam": "Socialist Republic of Vietnam",
  
    // Other common variations
    "Burma": "Myanmar",
    "Brunei": "Brunei Darussalam",
    "East Timor": "Timor-Leste",
    "UAE": "United Arab Emirates",
    "USA": "United States of America",
    "US": "United States of America",
    "America": "United States of America"
  };
  
  // Function to get official name
  export const getOfficialName = (countryName) => {
    // First check if this name exists in our mapping
    const officialName = countryNameMapping[countryName];
    if (officialName) {
      return officialName;
    }
  
    // If not in mapping, check if it's already an official name in our borders data
    // We'll import the borders directly to avoid async loading
    const borders = JSON.parse('/* borders json content */');
    if (borders[countryName]) {
      return countryName;
    }
  
    // Do a fuzzy match to handle case sensitivity and minor differences
    const possibleMatch = Object.entries(countryNameMapping)
      .find(([common, official]) => 
        common.toLowerCase() === countryName.toLowerCase() ||
        official.toLowerCase() === countryName.toLowerCase()
      );
  
    if (possibleMatch) {
      return possibleMatch[1];
    }
  
    return countryName;
  };
  
  // Function to get common name
  export const getCommonName = (officialName) => {
    // Find the first common name that maps to this official name
    const commonName = Object.entries(countryNameMapping)
      .find(([common, official]) => official === officialName);
    
    return commonName ? commonName[0] : officialName;
  };
  
  // Function to normalize a country name for comparison
  export const normalizeCountryName = (name) => {
    return getOfficialName(name);
  };