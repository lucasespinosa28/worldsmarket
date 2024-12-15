import React from 'react';

interface ButtonProps {
    onClick: () => void;
    disabled: boolean;
    color: 'blue' | 'red';
    children: React.ReactNode;
}

export default function Button({ onClick, disabled, color, children }: ButtonProps) {
    const baseClasses = "font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4";
    const colorClasses = {
        blue: "bg-blue-500 hover:bg-blue-700 text-white",
        red: "bg-red-500 hover:bg-red-700 text-white"
    };

    return (
        <button
            className={`${baseClasses} ${colorClasses[color]}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}