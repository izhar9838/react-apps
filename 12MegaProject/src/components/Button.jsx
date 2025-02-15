import React from 'react';
export default function Button({
    children,
    classNameNameName ="",
    textColor,
    type="button",
    bgColor="bg-blue-600",
    ...props
}){

    return(
        <button
        classNameNameName={`px-4 py-2 rounded-lg ${classNameNameName} ${bgColor} ${textColor} `}
        {...props}
        >
            {children}
        </button>
    )
}