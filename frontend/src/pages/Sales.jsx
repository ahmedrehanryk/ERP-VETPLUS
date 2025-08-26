import React, { useEffect, useState } from 'react'
import { API } from '../components/api'

export default function Sales(){
  const [customers, setCustomers] = useState([])
  const [items, setItems] = useState([])
  const [city, setCity] = useState('Lahore')
  const [custId, setCustId] = useState('')
  const [invItems, setInvItems] = useState([{item_id:'', qty:1, price:0}])
  const [invoices, setInvoices] = useState([])
  const [date, setDate] = useState(new Date().toISOString().slice(0,10))

  useEffect(()=>{ (async ()=>{ setCustomers(await API('/customers')); setItems(await API('/items')); setInvoices(await API('/sales/invoices')); })() }, [])

  const addLine = () => setInvItems([...invItems, {item_id:'', qty:1, price:0}])

  const submit = async e => {
    e.preventDefault()
    await API('/sales/invoice', { method:'POST', body: JSON.stringify({ customer_id: Number(custId), city, invoice_date: date, items: invItems }) })
    setInvItems([{item_id:'', qty:1, price:0}]); setCustId(''); setInvoices(await API('/sales/invoices'))
  }

  return (
    <div>
      <h1>Sales</h1>
      <form onSubmit={submit}>
        <select value={custId} onChange={e=>setCustId(e.target.value)}>
          <option value="">-- Customer --</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="City" value={city} onChange={e=>setCity(e.target.value)}/>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)}/>
        <button type="button" onClick={addLine}>Add Line</button>
        <button>Create Invoice</button>
      </form>

      {invItems.map((ln,idx)=> (
        <div key={idx} style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:8, marginTop:8}}>
          <select value={ln.item_id} onChange={e=>{
            const cp=[...invItems]; cp[idx].item_id = Number(e.target.value); setInvItems(cp);
          }}>
            <option value="">-- Item --</option>
            {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
          <input type="number" value={ln.qty} onChange={e=>{ const cp=[...invItems]; cp[idx].qty=Number(e.target.value); setInvItems(cp) }}/>
          <input type="number" value={ln.price} onChange={e=>{ const cp=[...invItems]; cp[idx].price=Number(e.target.value); setInvItems(cp) }}/>
        </div>
      ))}

      <h2 style={{marginTop:24}}>Recent Invoices</h2>
      <ul>{invoices.map(inv => <li key={inv.id}>INV #{inv.id} - {inv.city} - {inv.invoice_date} - Rs {inv.total}</li>)}</ul>
    </div>
  )
}
