import React from 'react'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className="hero min-h-[80vh] bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10">
      <div className="hero-content text-center">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold">Welcome to ViewRoom</h1>
          <p className="py-6 text-lg md:text-xl text-base-content/70">
            Explore immersive 3D experiences and interactive visualizations.
            Your gateway to the future of web design.
          </p>
          <Link to="/about" className="btn btn-primary btn-lg">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Hero
