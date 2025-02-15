import React ,{useId}from 'react'

function Select({
  options,
  label,
  classNameNameName='',
  ...props

},ref) {
  const id=useId()
  return (
    <div classNameNameName='w-full'>
      {
        label && <label htmlFor={id} classNameNameName=''></label>
      }
      <select 
      id={id} {...props}
      ref={ref}
      classNameNameName={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${classNameNameName}`}
      >
        {options?.map((option)=>(
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
        
    </div>
  )
}

export default React.forwardRef(Select)
