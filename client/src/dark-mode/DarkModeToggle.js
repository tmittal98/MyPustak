import React from 'react';

import Toggle from './Toggle';
import useDarkMode from 'use-dark-mode';

const DarkModeToggle = () => {
    const darkMode = useDarkMode(false);

    return (
        <div className="dark-mode-toggle">
            <button type="button" onClick={darkMode.disable}>
                <i className="fas fa-sun"></i>
            </button>
            <Toggle checked={darkMode.value} onChange={darkMode.toggle} />
            <button type="button" onClick={darkMode.enable}>
                <i className="fas fa-moon"></i>
            </button>
        </div>
    );
};

export default DarkModeToggle;
