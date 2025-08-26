import React, { useEffect, useState } from 'react'
import { API } from '../components/api'

export default function Inventory(){
  const [items, setItems] = useState([])
  const [form, setForm] = useState({name:'', sku:'', uom:'kg', price:0, is_raw:0, is_finished:0})

  const load = async () => setItems(await API('/items'))
  useEffect(()=>{ load() }, [])

  const submit = async e => {
    e.preventDefault()
    await API('/items', { method:'POST', body: JSON.stringify(form) })
    setForm({name:'', sku:'', uom:'kg', price:0, is_raw:0, is_finished:0})
    load()
  }

  return (
    <div>
      <h1>Inventory Items</h1>
      <form onSubmit={submit} style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:12, marginBottom:16}}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
        <input placeholder="SKU" value={form.sku} onChange={e=>setForm({...form, sku:e.target.value})}/>
        <input placeholder="UOM" value={form.uom} onChange={e=>setForm({...form, uom:e.target.value})}/>
        <input placeholder="Price" type="number" value={form.price} onChange={e=>setForm({...form, price:parseFloat(e.target.value)})}/>
        <label><input type="checkbox" checked={!!form.is_raw} onChange={e=>setForm({...form, is_raw:e.target.checked?1:0})}/> Raw</label>
        <label><input type="checkbox" checked={!!form.is_finished} onChange={e=>setForm({...form, is_finished:e.target.checked?1:0})}/> Finished</label>
        <button>Add</button>
      </form>

      <table border="1" cellPadding="6">
        <thead><tr><th>ID</th><th>Name</th><th>SKU</th><th>UOM</th><th>Price</th><th>Raw?</th><th>Finished?</th></tr></thead>
        <tbody>
          {items.map(x => (
            <tr key={x.id}>
              <td>{x.id}</td><td>{x.name}</td><td>{x.sku}</td><td>{x.uom}</td><td>{x.price}</td><td>{x.is_raw?'Yes':'No'}</td><td>{x.is_finished?'Yes':'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
