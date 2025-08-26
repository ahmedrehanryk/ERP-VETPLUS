import React, { useEffect, useState } from 'react'
import { API } from '../components/api'

export default function Purchase(){
  const [vendors, setVendors] = useState([])
  const [items, setItems] = useState([])
  const [poItems, setPoItems] = useState([])
  const [vendorId, setVendorId] = useState('')
  const [orderDate, setOrderDate] = useState(new Date().toISOString().slice(0,10))
  const [orders, setOrders] = useState([])

  useEffect(()=>{ (async ()=>{
    setVendors(await API('/vendors')); setItems(await API('/items')); setOrders(await API('/purchase/orders'))
  })() }, [])

  const addLine = () => setPoItems([...poItems, {item_id:'', qty:1, price:0}])

  const submit = async e => {
    e.preventDefault()
    await API('/purchase/orders', { method:'POST', body: JSON.stringify({ vendor_id: Number(vendorId), order_date: orderDate, items: poItems }) })
    setPoItems([]); setVendorId(''); setOrders(await API('/purchase/orders'))
  }

  return (
    <div>
      <h1>Purchase Orders</h1>
      <form onSubmit={submit}>
        <select value={vendorId} onChange={e=>setVendorId(e.target.value)}>
          <option value="">-- Vendor --</option>
          {vendors.map(v=> <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
        <input type="date" value={orderDate} onChange={e=>setOrderDate(e.target.value)}/>
        <button type="button" onClick={addLine}>Add Line</button>
        <button>Create PO</button>
      </form>

      {poItems.map((ln,idx)=> (
        <div key={idx} style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:8, marginTop:8}}>
          <select value={ln.item_id} onChange={e=>{
            const val = e.target.value; const cp = [...poItems]; cp[idx].item_id = Number(val); setPoItems(cp);
          }}>
            <option value="">-- Item --</option>
            {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
          <input type="number" value={ln.qty} onChange={e=>{ const cp=[...poItems]; cp[idx].qty=Number(e.target.value); setPoItems(cp) }}/>
          <input type="number" value={ln.price} onChange={e=>{ const cp=[...poItems]; cp[idx].price=Number(e.target.value); setPoItems(cp) }}/>
        </div>
      ))}

      <h2 style={{marginTop:24}}>Recent POs</h2>
      <ul>{orders.map(o => <li key={o.id}>PO #{o.id} - {o.status} - {o.order_date}</li>)}</ul>
    </div>
  )
}
