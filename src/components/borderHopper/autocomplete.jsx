import React, { useState, useRef, useEffect } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { countries } from '../../data/countries'; // Import from your countries data
import { getOfficialName, normalizeCountryName, isSameCountry } from '../../utils/countryNames'; // Import the name mapping functions
import { getISOCode } from '../../utils/countryISOCodes'; // Import the ISO code utility

const BorderHopperAutocomplete = ({ onSelect }) => {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e) => {
        const value = e.target.value;
        setInput(value);

        if (value.length > 0) {
            // Normalize the input for better matching
            const normalizedInput = value.toLowerCase();

            // Filter ALL countries based on user input, not just valid moves
            const filtered = countries
                .filter(country => {
                    if (typeof country !== 'string') return false;

                    // Check if the country name contains the input text
                    const directMatch = country.toLowerCase().includes(normalizedInput);
                    if (directMatch) return true;

                    // Check if any alias of the country matches the input
                    const commonName = country.toLowerCase();
                    const officialName = getOfficialName(country);
                    return officialName.toLowerCase().includes(normalizedInput);
                })
                .slice(0, 5); // Limit to 5 suggestions for better UX

            setSuggestions(filtered);
            setIsOpen(filtered.length > 0);
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
    };

    const handleSelect = (value) => {
        // Convert any alias to the official name before passing to onSelect
        const officialName = getOfficialName(value) || value;
        onSelect?.(officialName);
        setInput('');
        setSuggestions([]);
        setIsOpen(false);
    };

    const handleSubmit = () => {
        if (input.trim()) {
            // Try to find an exact match in the countries list first
            const exactMatch = countries.find(country =>
                isSameCountry(country, input)
            );

            if (exactMatch) {
                handleSelect(exactMatch);
            } else {
                // If no exact match, try to normalize and find a close match
                const normalizedInput = normalizeCountryName(input);
                const closeMatch = countries.find(country =>
                    normalizeCountryName(country) === normalizedInput
                );

                if (closeMatch) {
                    handleSelect(closeMatch);
                } else {
                    // If still no match, just use the input as is
                    handleSelect(input);
                }
            }
        }
    };

    return (
        <div ref={wrapperRef} className="w-full max-w-md mx-auto relative z-50">
            <div className="flex bg-white rounded-lg shadow-lg">
                <input
                    type="text"
                    value={input}
                    onChange={handleChange}
                    placeholder="Enter your guess..."
                    className="w-full px-4 py-3 rounded-l-lg border-0 outline-none"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSubmit();
                        }
                    }}
                />
                <button
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 
                              text-white font-bold rounded-r-lg"
                >
                    Submit
                </button>
            </div>

            {isOpen && suggestions.length > 0 && (
                <div className="absolute w-full mt-2 bg-white rounded-lg 
                               shadow-lg overflow-hidden z-50">
                    {suggestions.map((suggestion) => {
                        const isoCode = getISOCode(suggestion);
                        return (
                            <button
                                key={suggestion}
                                onClick={() => handleSelect(suggestion)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center"
                            >
                                {isoCode && (
                                    <span className="mr-3 flex-shrink-0">
                                        <ReactCountryFlag
                                            countryCode={isoCode}
                                            svg
                                            style={{
                                                width: '1.5em',
                                                height: '1.5em',
                                            }}
                                        />
                                    </span>
                                )}
                                <span>{suggestion}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default BorderHopperAutocomplete;