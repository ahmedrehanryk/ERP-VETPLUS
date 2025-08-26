import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Inventory from './pages/Inventory.jsx'
import Purchase from './pages/Purchase.jsx'
import Sales from './pages/Sales.jsx'
import Recipes from './pages/Recipes.jsx'
import Production from './pages/Production.jsx'
import Reports from './pages/Reports.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>}>
        <Route index element={<Dashboard/>} />
        <Route path="inventory" element={<Inventory/>} />
        <Route path="purchase" element={<Purchase/>} />
        <Route path="sales" element={<Sales/>} />
        <Route path="recipes" element={<Recipes/>} />
        <Route path="production" element={<Production/>} />
        <Route path="reports" element={<Reports/>} />
      </Route>
    </Routes>
  </BrowserRouter>
)
