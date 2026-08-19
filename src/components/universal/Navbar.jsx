import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import ThemeToggle from '../reuseable/ThemeToggle'

function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl">ViewRoom</Link>
      </div>
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? 'active font-bold' : ''}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) => isActive ? 'active font-bold' : ''}
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) => isActive ? 'active font-bold' : ''}
            >
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <ThemeToggle />
        <div className="dropdown dropdown-end md:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
            <li><NavLink to="/" className={({ isActive }) => isActive ? 'active font-bold' : ''}>Home</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active font-bold' : ''}>About</NavLink></li>
            <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'active font-bold' : ''}>Contact</NavLink></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
