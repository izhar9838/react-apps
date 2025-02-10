import React from 'react';
export default function Button({
    children,
    className ="",
    textColor,
    type="button",
    bgColor="bg-blue-600",
    ...props
}){

    return(
        <button
        className={`px-4 py-2 rounded-lg ${className} ${bgColor} ${textColor} `}
        {...props}
        >
            {children}
        </button>
    )
}