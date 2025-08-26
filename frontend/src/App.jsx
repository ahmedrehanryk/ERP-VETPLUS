import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import Nav from './components/Nav.jsx'

export default function App(){
  return (
    <div style={{display:'grid', gridTemplateColumns:'240px 1fr', minHeight:'100vh', fontFamily:'Inter, system-ui, sans-serif'}}>
      <aside style={{background:'#0f172a', color:'white', padding:'16px'}}>
        <h2 style={{marginTop:0}}>ERP</h2>
        <Nav/>
      </aside>
      <main style={{padding:'24px'}}>
        <Outlet/>
      </main>
    </div>
  )
}
