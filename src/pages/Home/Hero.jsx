import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/reuseable/Button'

function Hero() {
  return (
    <section className="flex min-h-[85vh] w-full items-center justify-center bg-base-100/95 px-4 py-16 text-white">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* Title */}
        <h1 className="text-4xl font-extrabold uppercase leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Step Inside. Before <br className="hidden sm:inline" />
          You Step In.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-base text-gray-300 sm:text-lg md:text-xl">
          Explore homes, hotels and spaces through immersive 360° experiences. Move
          through rooms before you ever arrive.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link to="/explore">
            <Button className="rounded-full bg-[#d4d4d4] px-8 py-3 font-semibold text-gray-900 transition-colors hover:bg-white">
              Explore
            </Button>
          </Link>
          <Link to="/create">
            <Button className="rounded-full bg-[#e5e5e5] px-8 py-3 font-semibold text-gray-900 transition-colors hover:bg-white">
              Create
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero