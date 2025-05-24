import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    className?: string;
}

export const Button = ({ children, className = '', ...props }: ButtonProps) => (
    <button
        className={`font-semibold py-2 px-4 rounded-md transition-colors shadow-md hover:shadow-lg focus:outline-none ${className}`}
        {...props}
    >
        {children}
    </button>
);