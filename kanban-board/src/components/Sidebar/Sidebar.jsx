import React from 'react'

export default function Sidebar() {
  return (
    <aside style={{width: 220, padding: 12, borderRight: '1px solid #eee'}}>
      <h4>Navigation</h4>
      <ul style={{listStyle:'none', padding:0}}>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/">Home</a></li>
        <li><a href="/board/default">Boards</a></li>
        <li><a href="/profile">Profile</a></li>
        <li><a href="/settings">Settings</a></li>
      </ul>
    </aside>
  )
}
