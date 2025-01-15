import React from 'react';
// import Coding from './code.jsx'
function Coding(){
  return(
      <>
      <h1>Hello world from Izhar</h1>
      <p>My name is Izhar Ali I am from Kushinagar District</p>
      </>
  )
}

const reactElement = {
  type:'a',
  props:{
      href:'https://www.google.com',
      target:'_blank'
  },
  children:'Click here to go to google'
}
const element=(
  <a href="https://google.com">Click Here</a>
)
// create element by using react standard
const reactElement1 =React.createElement(
                              'a',//type of element
                              {href:'https://www.google.com',target:'_blank'}, //props of element
                               'Click here to go to google') //children of element
function App() {
  return (
    
    reactElement1
    
    
    
  )
}

export default App
