import React, {useId}from 'react';

const Input =React.forwardRef(function Input({
    type='text',
    classNameNameName='',
    label,
    ...props
},ref){
    const id=useId();
    return(
        <div classNameNameName='w-full'>
            {label &&(
                <label classNameNameName='inline-block mb-1 pl-1' htmlFor={id}>
                    {label}
                </label>

            )}
            <input classNameNameName={`${classNameNameName} px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-grey-50 duration-200 border border-gray-200 w-full`} type={type} ref={ref}{...props}/>
        </div>
    )
})
export default Input;