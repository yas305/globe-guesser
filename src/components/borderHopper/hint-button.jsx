import React, { useState, useCallback, useEffect } from 'react';
import useBorderHopperStore from '../../store/borderHopperStore';

const HintButton = () => {
    const [isPressed, setIsPressed] = useState(false);
    const setShowHint = useBorderHopperStore(state => state.setShowHint);
    const showHint = useBorderHopperStore(state => state.showHint);

    // Sync local state with store state
    useEffect(() => {
        setIsPressed(showHint);
    }, [showHint]);

    // Handle mouse down event
    const handleMouseDown = useCallback(() => {
        console.log("Mouse down - showing hint");
        setIsPressed(true);
        setShowHint(true);

        // Add a visual indicator for debugging
        document.body.style.setProperty('--hint-active', 'true');
    }, [setShowHint]);

    // Handle mouse up event
    const handleMouseUp = useCallback(() => {
        console.log("Mouse up - hiding hint");
        setIsPressed(false);
        setShowHint(false);

        // Remove visual indicator
        document.body.style.setProperty('--hint-active', 'false');
    }, [setShowHint]);

    // Handle mouse leave to prevent stuck state
    const handleMouseLeave = useCallback(() => {
        if (isPressed) {
            console.log("Mouse leave - hiding hint");
            setIsPressed(false);
            setShowHint(false);

            // Remove visual indicator
            document.body.style.setProperty('--hint-active', 'false');
        }
    }, [isPressed, setShowHint]);

    // Handle key events for accessibility
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleMouseDown();
        }
    }, [handleMouseDown]);

    const handleKeyUp = useCallback((e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleMouseUp();
        }
    }, [handleMouseUp]);

    return (
        <button
            className={`mt-4 px-4 py-2 rounded-lg font-medium transition-all duration-150 relative z-50
                 ${isPressed
                    ? 'bg-blue-700 text-white shadow-inner'
                    : 'bg-blue-500 text-white shadow-md hover:bg-blue-600'}`}
            style={{
                position: 'relative',
                zIndex: 50,
                pointerEvents: 'auto'
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            role="button"
            tabIndex={0}
            aria-pressed={isPressed}
            data-testid="hint-button"
        >
            {isPressed ? 'Showing Hints...' : 'Hold for Hints'}
        </button>
    );
};

export default HintButton; 