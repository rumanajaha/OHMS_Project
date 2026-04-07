import { useState } from 'react'
import Login from './pages/Login'
import './App.css'

import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
   
      <Routes>
        <Route path="/" element={<Login/>}/>
     
      </Routes>
   
  </Router>
  )
}

export default App
