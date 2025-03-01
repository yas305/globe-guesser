import React, { useState, useRef, useEffect } from 'react';
import useBorderHopperStore from '../../store/borderHopperStore';
import { getCommonName, getOfficialName } from '../../utils/countryNames';

// Placeholder for all countries (replace with your data source)
const allCountries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", // ... more countries
    "United States", "United Kingdom", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

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
            const filtered = allCountries.filter(country =>
                getCommonName(country).toLowerCase().startsWith(value.toLowerCase()) ||
                country.toLowerCase().startsWith(value.toLowerCase())
            );
            setSuggestions(filtered);
            setIsOpen(true);
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
    };

    const handleSelect = (value) => {
        const officialName = getOfficialName(value);
        onSelect?.(officialName);
        setInput('');
        setSuggestions([]);
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="w-full max-w-md mx-auto relative z-50">
            <div className="flex bg-white rounded-lg shadow-lg">
                <input
                    type="text"
                    value={input}
                    onChange={handleChange}
                    placeholder="Enter a country name..."
                    className="w-full px-4 py-3 rounded-l-lg border-0 outline-none"
                />
                <button 
                    onClick={() => handleSelect(input)}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 
                                     text-white font-bold rounded-r-lg"
                >
                    Submit
                </button>
            </div>

            {isOpen && suggestions.length > 0 && (
                <div className="absolute w-full mt-2 bg-white rounded-lg 
                                     shadow-lg overflow-hidden z-50">
                    {suggestions.map((country) => (
                        <button
                            key={country}
                            onClick={() => handleSelect(country)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-100"
                        >
                            {getCommonName(country)}
                            {getCommonName(country) !== country && (
                                <span className="text-gray-500 text-sm ml-2">
                                    ({country})
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BorderHopperAutocomplete;