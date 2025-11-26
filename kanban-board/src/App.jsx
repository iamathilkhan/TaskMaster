import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import KanbanBoard from './components/Board/KanbanBoard'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import './styles/globals.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<KanbanBoard />} />
      </Routes>
    </BrowserRouter>
  )
}
