import React, { useEffect, useState } from 'react'
import { API } from '../components/api'

export default function Recipes(){
  const [items, setItems] = useState([])
  const [boms, setBoms] = useState([])
  const [form, setForm] = useState({name:'', output_item_id:'', output_qty:1})
  const [lines, setLines] = useState([])

  useEffect(()=>{ (async ()=>{ setItems(await API('/items')); setBoms(await API('/recipes')) })() }, [])

  const addLine = () => setLines([...lines, {item_id:'', qty:0}])

  const submit = async e => {
    e.preventDefault()
    await API('/recipes', { method:'POST', body: JSON.stringify({ ...form, output_item_id: Number(form.output_item_id), lines }) })
    setForm({name:'', output_item_id:'', output_qty:1}); setLines([]); setBoms(await API('/recipes'))
  }

  return (
    <div>
      <h1>Recipes / BOM</h1>
      <form onSubmit={submit}>
        <input placeholder="Recipe Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
        <select value={form.output_item_id} onChange={e=>setForm({...form, output_item_id:e.target.value})}>
          <option value="">-- Output Item --</option>
          {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
        <input type="number" value={form.output_qty} onChange={e=>setForm({...form, output_qty:Number(e.target.value)})}/>
        <button type="button" onClick={addLine}>Add Ingredient</button>
        <button>Create Recipe</button>
      </form>

      {lines.map((ln, idx) => (
        <div key={idx} style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:8, marginTop:8}}>
          <select value={ln.item_id} onChange={e=>{
            const cp=[...lines]; cp[idx].item_id = Number(e.target.value); setLines(cp);
          }}>
            <option value="">-- Item --</option>
            {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
          <input type="number" value={ln.qty} onChange={e=>{ const cp=[...lines]; cp[idx].qty = Number(e.target.value); setLines(cp) }}/>
        </div>
      ))}

      <h2 style={{marginTop:24}}>Existing Recipes</h2>
      <ul>{boms.map(b => <li key={b.id}>#{b.id} {b.name} ➜ item {b.output_item_id} x {b.output_qty}</li>)}</ul>
    </div>
  )
}
