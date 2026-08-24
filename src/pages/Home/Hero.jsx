import React, { useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Button from '../../components/reuseable/Button'

function createPanoramaTexture() {
  const width = 2048
  const height = 1024
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  const sky = ctx.createLinearGradient(0, 0, 0, height)
  sky.addColorStop(0, '#04050d')
  sky.addColorStop(0.22, '#0a0f24')
  sky.addColorStop(0.36, '#181c3a')
  sky.addColorStop(0.46, '#3a3054')
  sky.addColorStop(0.5, '#7a4f63')
  sky.addColorStop(0.54, '#b06a52')
  sky.addColorStop(0.58, '#41243a')
  sky.addColorStop(0.66, '#160f1e')
  sky.addColorStop(1, '#050308')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, width, height)

  ctx.globalCompositeOperation = 'screen'

  const sunX = width * 0.66
  const sunY = height * 0.52
  const glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, height * 0.42)
  glow.addColorStop(0, 'rgba(255, 196, 128, 0.95)')
  glow.addColorStop(0.18, 'rgba(255, 150, 84, 0.5)')
  glow.addColorStop(0.5, 'rgba(180, 92, 70, 0.16)')
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, width, height)

  const horizonBand = ctx.createLinearGradient(0, height * 0.34, 0, height * 0.62)
  horizonBand.addColorStop(0, 'rgba(0, 0, 0, 0)')
  horizonBand.addColorStop(0.5, 'rgba(214, 118, 78, 0.28)')
  horizonBand.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = horizonBand
  ctx.fillRect(0, height * 0.34, width, height * 0.28)

  ctx.globalCompositeOperation = 'source-over'

  for (let i = 0; i < 650; i++) {
    const x = Math.random() * width
    const y = Math.random() * height * 0.42
    const r = Math.random() * 1.3 + 0.2
    const a = Math.random() * 0.65 + 0.1
    ctx.fillStyle = `rgba(255, 255, 255, ${a})`
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.filter = 'blur(7px)'
  for (let i = 0; i < 16; i++) {
    const cx = Math.random() * width
    const cy = height * (0.36 + Math.random() * 0.13)
    const rw = width * (0.04 + Math.random() * 0.1)
    const rh = height * (0.008 + Math.random() * 0.02)
    ctx.fillStyle = `rgba(255, 176, 130, ${0.04 + Math.random() * 0.06})`
    ctx.beginPath()
    ctx.ellipse(cx, cy, rw, rh, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.filter = 'none'

  const groundGlow = ctx.createRadialGradient(sunX, height * 0.58, 0, sunX, height * 0.58, height * 0.3)
  groundGlow.addColorStop(0, 'rgba(196, 108, 66, 0.2)')
  groundGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = groundGlow
  ctx.fillRect(0, height * 0.52, width, height * 0.48)

  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.015)' : 'rgba(0, 0, 0, 0.03)'
    ctx.fillRect(x, y, 1.5, 1.5)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  return texture
}

function PanoramaSphere() {
  const texture = useMemo(() => createPanoramaTexture(), [])

  useEffect(() => () => texture.dispose(), [texture])

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[80, 64, 48]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} fog={false} toneMapped={false} />
    </mesh>
  )
}

function Dust({ count = 280 }) {
  const ref = useRef()

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 7 + Math.random() * 26
      const angle = Math.random() * Math.PI * 2
      arr[i * 3] = Math.cos(angle) * radius
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16
      arr[i * 3 + 2] = Math.sin(angle) * radius
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.008
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        color="#ffd9b0"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function PanoramaControls() {
  const ref = useRef()
  const idleTimer = useRef()

  const handleStart = () => {
    window.clearTimeout(idleTimer.current)
    if (ref.current) ref.current.autoRotate = false
  }

  const handleEnd = () => {
    window.clearTimeout(idleTimer.current)
    idleTimer.current = window.setTimeout(() => {
      if (ref.current) ref.current.autoRotate = true
    }, 3000)
  }

  useEffect(() => () => window.clearTimeout(idleTimer.current), [])

  return (
    <OrbitControls
      ref={ref}
      makeDefault
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.07}
      rotateSpeed={-0.4}
      autoRotate
      autoRotateSpeed={0.35}
      minPolarAngle={Math.PI * 0.12}
      maxPolarAngle={Math.PI * 0.88}
      onStart={handleStart}
      onEnd={handleEnd}
    />
  )
}

function DragIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      {...props}
    >
      <path d="M8.5 8 4.5 12l4 4" />
      <path d="m15.5 8 4 4-4 4" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  )
}

function Hero() {
  return (
    <section className="relative h-[calc(100svh-72px)] min-h-[560px] w-full overflow-hidden bg-base-100">
      <div className="absolute inset-0">
        <Canvas
          camera={{ fov: 75, near: 0.1, far: 200, position: [0, 0, 0.01] }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          flat
        >
          <fog attach="fog" args={['#07060d', 18, 70]} />
          <PanoramaSphere />
          <Dust />
          <PanoramaControls />
        </Canvas>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/70" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 42%, rgba(0, 0, 0, 0.55) 100%)' }}
      />

      <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="h-px w-8 bg-white/50 sm:w-12" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-white/80 sm:text-xs">
            Immersive Spaces
          </span>
          <span className="h-px w-8 bg-white/50 sm:w-12" />
        </div>

        <h1 className="mt-6 text-[clamp(2.75rem,7.5vw,7rem)] leading-[1.02] text-white">
          Step inside.
          <br />
          <span className="italic text-white/90">Before you step in.</span>
        </h1>

        <p className="mt-6 max-w-xl text-sm text-white/70 sm:text-base md:max-w-2xl md:text-lg">
          Explore homes, hotels and spaces through immersive 360° experiences. Move through every
          room, angle and detail before you ever arrive.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link to="/explore" className="pointer-events-auto [&>button]:px-8 [&>button]:py-3 [&>button]:text-base">
            <Button variant="primary">Explore Spaces</Button>
          </Link>
          <Link to="/create" className="pointer-events-auto [&>button]:px-8 [&>button]:py-3 [&>button]:text-base">
            <Button variant="secondary">Create a Virtual Tour</Button>
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 sm:bottom-8">
        <div className="flex animate-pulse items-center gap-2.5 rounded-full border border-white/15 bg-black/30 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-white/70 backdrop-blur-md sm:text-[13px]">
          <DragIcon />
          Drag to explore
        </div>
      </div>
    </section>
  )
}

export default Hero
