import React, { useState, useRef, useEffect } from 'react';
import { countries } from '../../data/countries';

const Autocomplete = ({ onSelect, onSuggestionsChange }) => {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                onSuggestionsChange(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onSuggestionsChange]);

    const handleChange = (e) => {
        const value = e.target.value;
        setInput(value);
        
        if (value.length > 0) {
          const filtered = countries
            .filter(country => typeof country === 'string' && 
              country.toLowerCase().includes(value.toLowerCase()))
            .slice(0, 3);
          setSuggestions(filtered);
          setIsOpen(true);
        } else {
          setSuggestions([]);
          setIsOpen(false);
        }
      };

    const handleSelect = (value) => {
        setInput(value);
        setSuggestions([]);
        setIsOpen(false);
        onSuggestionsChange(false);
        onSelect?.(value);
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-[320px] mx-auto mb-4 z-50">
            <input
                type="text"
                value={input}
                onChange={handleChange}
                placeholder="Enter a country..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none font-medium text-lg"
            />

            {isOpen && suggestions.length > 0 && (
                <div className="absolute w-full mt-2 bg-white rounded-xl shadow-lg border overflow-hidden">
                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion}
                            onClick={() => handleSelect(suggestion)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors block text-lg"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Autocomplete;