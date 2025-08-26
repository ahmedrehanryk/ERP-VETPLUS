import React, { useEffect, useState } from 'react'
import { API } from '../components/api'

export default function Production(){
  const [boms, setBoms] = useState([])
  const [qty, setQty] = useState(1)
  const [bomId, setBomId] = useState('')

  useEffect(()=>{ (async ()=>{ setBoms(await API('/recipes')) })() }, [])

  const createWO = async () => {
    const ret = await API('/production/work-orders', { method:'POST', body: JSON.stringify({ bom_id: Number(bomId), quantity: Number(qty) }) })
    alert('WO Created #' + ret.id)
  }

  const completeWO = async () => {
    const id = prompt('Work Order ID to complete:')
    if (!id) return
    await API(`/production/work-orders/${id}/complete`, { method:'POST', body: JSON.stringify({}) })
    alert('WO Completed')
  }

  return (
    <div>
      <h1>Production</h1>
      <select value={bomId} onChange={e=>setBomId(e.target.value)}>
        <option value="">-- Select BOM --</option>
        {boms.map(b => <option key={b.id} value={b.id}>#{b.id} {b.name}</option>)}
      </select>
      <input type="number" value={qty} onChange={e=>setQty(e.target.value)}/>
      <button onClick={createWO}>Create Work Order</button>
      <button onClick={completeWO}>Complete Work Order</button>
    </div>
  )
}
