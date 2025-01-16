import './App.css'
import Card from './components/Card.jsx'

function App() {
  const newObj={
    desg:'Staff Engineer, Algolia',

  }
  const newObj1={
    desg:'Graphic Eng, India',
    
  }

  return (
    <>
     <Card username='Pooja'obj={newObj}/>
     <Card username='Devi' obj={newObj1}/>
    </>
  )
}

export default App
