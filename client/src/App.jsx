import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import VotingPage from './pages/VotingPage'
import StatisticPage from './pages/StatisticPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
    <Routes>
      <Route path='/' element = {<VotingPage/>}/>
      <Route path='/stat' element = {<StatisticPage/>}/>
    </Routes>
    </Router>
  )
}

export default App
