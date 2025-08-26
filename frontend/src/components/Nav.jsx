import React from 'react'
import { Link } from 'react-router-dom'

const Item = ({to, children}) => (
  <div style={{margin:'8px 0'}}>
    <Link to={to} style={{color:'white', textDecoration:'none'}}>{children}</Link>
  </div>
)

export default function Nav(){
  return (
    <nav>
      <Item to="/">Dashboard</Item>
      <Item to="/inventory">Inventory</Item>
      <Item to="/purchase">Purchase</Item>
      <Item to="/sales">Sales</Item>
      <Item to="/recipes">Recipes</Item>
      <Item to="/production">Production</Item>
      <Item to="/reports">Reports</Item>
    </nav>
  )
}
