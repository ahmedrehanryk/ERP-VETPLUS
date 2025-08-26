import React, { useEffect, useState } from 'react'
import { API } from '../components/api'

export default function Reports(){
  const [stock, setStock] = useState([])
  const [salesByCity, setSalesByCity] = useState([])
  const [pl, setPL] = useState({})

  useEffect(()=>{ (async ()=>{
    setStock(await API('/reports/stock'))
    setSalesByCity(await API('/reports/sales-by-city'))
    setPL(await API('/reports/profit-loss'))
  })() }, [])

  return (
    <div>
      <h1>Reports</h1>
      <h2>Stock</h2>
      <table border="1" cellPadding="6">
        <thead><tr><th>Item</th><th>Stock</th></tr></thead>
        <tbody>{stock.map(s => <tr key={s.id}><td>{s.name}</td><td>{Number(s.stock).toFixed(3)}</td></tr>)}</tbody>
      </table>

      <h2>Sales by City</h2>
      <ul>{salesByCity.map(r => <li key={r.city}>{r.city}: Rs {r.sales}</li>)}</ul>

      <h2>Profit & Loss (Simplified)</h2>
      <pre>{JSON.stringify(pl,null,2)}</pre>
    </div>
  )
}
