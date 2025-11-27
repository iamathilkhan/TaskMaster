import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import styles from './ProtectedLayout.module.css'

export default function ProtectedLayout() {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.inner}>
        <aside className={styles.sidebar}><Sidebar /></aside>
        <main className={styles.main}><Outlet /></main>
      </div>
    </div>
  )
}
