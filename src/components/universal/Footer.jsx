import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer footer-center bg-base-300 text-base-content p-6">
      <aside>
        <p>Copyright &copy; {new Date().getFullYear()} - ViewRoom. All rights reserved.</p>
      </aside>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <Link to="/" className="link link-hover">Home</Link>
          <Link to="/about" className="link link-hover">About</Link>
          <Link to="/contact" className="link link-hover">Contact</Link>
        </div>
      </nav>
    </footer>
  )
}

export default Footer
