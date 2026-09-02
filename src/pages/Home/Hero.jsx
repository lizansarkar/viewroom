import React, { useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Button from '../../components/reuseable/Button'

function createDiskTexture() {
  const size = 1024
  const c = size / 2
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const innerRatio = 2.3 / 6.4
  const rIn = c * innerRatio
  const rOut = c

  ctx.clearRect(0, 0, size, size)
  ctx.lineCap = 'round'

  const palette = [
    [255, 243, 217, 0.85],
    [255, 217, 160, 0.7],
    [255, 185, 122, 0.6],
    [231, 127, 78, 0.5],
    [168, 74, 53, 0.45],
    [110, 47, 40, 0.4],
  ]

  for (let i = 0; i < 720; i++) {
    if (Math.random() > 0.9) continue
    const r = rIn + Math.pow(Math.random(), 1.35) * (rOut - rIn)
    const a0 = Math.random() * Math.PI * 2
    const sweep = (0.3 + Math.random() * 2.8) * (Math.random() > 0.5 ? 1 : -1)
    const col = palette[(Math.random() * palette.length) | 0]
    ctx.globalAlpha = 0.12 + Math.random() * 0.5
    ctx.lineWidth = 1.5 + Math.random() * 6
    ctx.strokeStyle = `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${col[3]})`
    ctx.beginPath()
    ctx.arc(c, c, r, a0, a0 + sweep)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  const innerGlow = ctx.createRadialGradient(c, c, rIn * 0.86, c, c, rIn * 1.9)
  innerGlow.addColorStop(0, 'rgba(255, 236, 205, 0)')
  innerGlow.addColorStop(0.45, 'rgba(255, 220, 170, 0.24)')
  innerGlow.addColorStop(1, 'rgba(255, 190, 130, 0)')
  ctx.fillStyle = innerGlow
  ctx.fillRect(0, 0, size, size)

  ctx.filter = 'blur(1.5px)'
  ctx.drawImage(canvas, 0, 0)
  ctx.filter = 'none'

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function createPhotonRingTexture() {
  const size = 1024
  const c = size / 2
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, size, size)

  const g = ctx.createRadialGradient(c, c, 0, c, c, c)
  g.addColorStop(0, 'rgba(255, 255, 255, 0)')
  g.addColorStop(0.78, 'rgba(255, 255, 255, 0)')
  g.addColorStop(0.82, 'rgba(255, 228, 186, 0.3)')
  g.addColorStop(0.845, 'rgba(255, 250, 235, 1)')
  g.addColorStop(0.9, 'rgba(255, 205, 150, 0.4)')
  g.addColorStop(0.97, 'rgba(255, 170, 110, 0.05)')
  g.addColorStop(1, 'rgba(255, 160, 100, 0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function PhotonRing() {
  const ref = useRef()
  const texture = useMemo(() => createPhotonRingTexture(), [])

  useEffect(() => () => texture.dispose(), [texture])

  useFrame(({ camera }) => {
    if (ref.current) ref.current.lookAt(camera.position)
  })

  return (
    <mesh ref={ref}>
      <ringGeometry args={[1.94, 2.34, 128, 2]} />
      <meshBasicMaterial
        map={texture}
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}

function BlackHole() {
  const diskRef = useRef()
  const diskTexture = useMemo(() => createDiskTexture(), [])

  useEffect(() => () => diskTexture.dispose(), [diskTexture])

  useFrame((_, delta) => {
    if (diskRef.current) diskRef.current.rotation.z += delta * 0.03
  })

  return (
    <group>
      {/* Event horizon */}
      <mesh>
        <sphereGeometry args={[1.9, 64, 48]} />
        <meshBasicMaterial color="#030206" toneMapped={false} />
      </mesh>

      {/* Tilted accretion disk (spin animated) */}
      <mesh ref={diskRef} rotation={[Math.PI / 2 - 0.14, 0, 0.6]}>
        <ringGeometry args={[2.3, 6.4, 256, 4]} />
        <meshBasicMaterial
          map={diskTexture}
          transparent
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Photon ring — always faces the camera */}
      <PhotonRing />
    </group>
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
          camera={{ fov: 60, near: 0.1, far: 200, position: [0, 0, 6.2] }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          flat
        >
          <fog attach="fog" args={['#050307', 12, 42]} />
          <BlackHole />
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
    </section>
  )
}

export default Hero
