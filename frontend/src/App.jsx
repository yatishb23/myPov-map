import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PlainMap from './plainMap'
import LeafletMapWithSearch from './newMap'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <PlainMap/>
      {/* <LeafletMapWithSearch/> */}
    </>
  )
}

export default App
