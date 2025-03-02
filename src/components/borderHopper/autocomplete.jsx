import React, { useState, useRef, useEffect } from 'react';
import { countries } from '../../data/countries'; // Import from your countries data

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
            // Filter ALL countries based on user input, not just valid moves
            const filtered = countries
                .filter(country => 
                    typeof country === 'string' && 
                    country.toLowerCase().includes(value.toLowerCase())
                )
                .slice(0, 5); // Limit to 5 suggestions for better UX
            
            setSuggestions(filtered);
            setIsOpen(filtered.length > 0);
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
    };

    const handleSelect = (value) => {
        onSelect?.(value);
        setInput('');
        setSuggestions([]);
        setIsOpen(false);
    };

    const handleSubmit = () => {
        if (input.trim()) {
            handleSelect(input);
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
                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion}
                            onClick={() => handleSelect(suggestion)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-100"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BorderHopperAutocomplete;