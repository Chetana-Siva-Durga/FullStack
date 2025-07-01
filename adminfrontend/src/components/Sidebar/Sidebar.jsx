import React from 'react'
import { NavLink } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className='sidebar-options'>
        <NavLink to='/add' className="sidebar-option">
          <span className="sidebar-icon" role="img" aria-label="Add">➕</span>
          <p>Add Items</p>
        </NavLink>
        
        <NavLink to='/orders' className="sidebar-option">
          <span className="sidebar-icon" role="img" aria-label="Orders">🧾</span>
          <p>Orders</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
