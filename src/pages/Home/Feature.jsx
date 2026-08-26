import React, { useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from '../../components/reuseable/Button'

gsap.registerPlugin(ScrollTrigger)

/* ─────────────────────────────────────────────
   Procedural architectural panorama texture
   ───────────────────────────────────────────── */
function createArchitecturalTexture() {
  const w = 2048
  const h = 1024
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  // Sky through windows
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.5)
  sky.addColorStop(0, '#b8cce0')
  sky.addColorStop(0.5, '#d4dfe8')
  sky.addColorStop(1, '#e8e4dc')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, w, h * 0.5)

  // Floor
  const floor = ctx.createLinearGradient(0, h * 0.5, 0, h)
  floor.addColorStop(0, '#c8b8a0')
  floor.addColorStop(0.15, '#b8a890')
  floor.addColorStop(1, '#8a7a68')
  ctx.fillStyle = floor
  ctx.fillRect(0, h * 0.5, w, h * 0.5)

  // Floor wood grain lines
  ctx.strokeStyle = 'rgba(100, 80, 60, 0.12)'
  ctx.lineWidth = 1
  for (let i = 0; i < 40; i++) {
    const y = h * 0.5 + (h * 0.5) * (i / 40)
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
    ctx.stroke()
  }

  // Ceiling
  const ceiling = ctx.createLinearGradient(0, 0, 0, h * 0.12)
  ceiling.addColorStop(0, '#f0ece6')
  ceiling.addColorStop(1, '#e0dbd4')
  ctx.fillStyle = ceiling
  ctx.fillRect(0, 0, w, h * 0.12)

  // Walls
  ctx.fillStyle = '#e8e2da'
  ctx.fillRect(0, h * 0.12, w, h * 0.38)

  // Wall texture — subtle panels
  ctx.strokeStyle = 'rgba(0,0,0,0.03)'
  ctx.lineWidth = 1
  for (let i = 0; i < 16; i++) {
    const x = (w / 16) * i
    ctx.beginPath()
    ctx.moveTo(x, h * 0.12)
    ctx.lineTo(x, h * 0.5)
    ctx.stroke()
  }

  // Horizontal wall trim
  ctx.fillStyle = '#d8d2ca'
  ctx.fillRect(0, h * 0.47, w, h * 0.03)

  // Windows — large floor-to-ceiling
  const windowCount = 5
  for (let i = 0; i < windowCount; i++) {
    const wx = w * (0.06 + (i / windowCount) * 0.88)
    const ww = w * 0.12
    const wh = h * 0.34
    const wy = h * 0.14

    // Window frame
    ctx.fillStyle = '#2a2520'
    ctx.fillRect(wx - 4, wy, ww + 8, wh)

    // Glass — sky gradient
    const glass = ctx.createLinearGradient(wx, wy, wx, wy + wh)
    glass.addColorStop(0, '#a0bcd4')
    glass.addColorStop(0.4, '#c8d8e4')
    glass.addColorStop(0.7, '#d8d0c4')
    glass.addColorStop(1, '#c0b8a8')
    ctx.fillStyle = glass
    ctx.fillRect(wx, wy, ww, wh)

    // Window mullion
    ctx.fillStyle = '#2a2520'
    ctx.fillRect(wx + ww * 0.5 - 2, wy, 4, wh)
    ctx.fillRect(wx, wy + wh * 0.5 - 2, ww, 4)

    // Outside trees/horizon hint
    ctx.fillStyle = 'rgba(60, 80, 50, 0.15)'
    ctx.beginPath()
    ctx.ellipse(wx + ww * 0.3, wy + wh * 0.7, ww * 0.25, wh * 0.12, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(wx + ww * 0.7, wy + wh * 0.75, ww * 0.2, wh * 0.1, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  // Light beams from windows
  ctx.globalCompositeOperation = 'soft-light'
  for (let i = 0; i < windowCount; i++) {
    const wx = w * (0.06 + (i / windowCount) * 0.88) + w * 0.06
    const beam = ctx.createLinearGradient(wx, h * 0.14, wx + 40, h * 0.8)
    beam.addColorStop(0, 'rgba(255, 240, 210, 0.25)')
    beam.addColorStop(1, 'rgba(255, 240, 210, 0)')
    ctx.fillStyle = beam
    ctx.beginPath()
    ctx.moveTo(wx - 20, h * 0.14)
    ctx.lineTo(wx + 80, h * 0.75)
    ctx.lineTo(wx - 40, h * 0.75)
    ctx.closePath()
    ctx.fill()
  }
  ctx.globalCompositeOperation = 'source-over'

  // Furniture silhouettes — sofa
  ctx.fillStyle = 'rgba(60, 50, 40, 0.18)'
  const sofaX = w * 0.35
  const sofaY = h * 0.52
  ctx.beginPath()
  ctx.roundRect(sofaX, sofaY, w * 0.18, h * 0.08, 6)
  ctx.fill()
  // Sofa back
  ctx.fillStyle = 'rgba(60, 50, 40, 0.14)'
  ctx.beginPath()
  ctx.roundRect(sofaX, sofaY - h * 0.06, w * 0.18, h * 0.06, [6, 6, 0, 0])
  ctx.fill()

  // Coffee table
  ctx.fillStyle = 'rgba(50, 40, 30, 0.12)'
  ctx.fillRect(w * 0.4, h * 0.62, w * 0.08, h * 0.015)

  // Plant
  ctx.fillStyle = 'rgba(40, 70, 40, 0.15)'
  ctx.beginPath()
  ctx.ellipse(w * 0.82, h * 0.38, w * 0.018, h * 0.04, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(60, 50, 40, 0.12)'
  ctx.fillRect(w * 0.815, h * 0.42, w * 0.008, h * 0.06)

  // Rug
  ctx.fillStyle = 'rgba(140, 100, 70, 0.08)'
  ctx.beginPath()
  ctx.ellipse(w * 0.45, h * 0.65, w * 0.12, h * 0.06, 0, 0, Math.PI * 2)
  ctx.fill()

  // Ambient noise
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.012)' : 'rgba(0,0,0,0.018)'
    ctx.fillRect(x, y, 1.5, 1.5)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  return texture
}

/* ─────────────────────────────────────────────
   3D Scene components
   ───────────────────────────────────────────── */
function ArchSphere() {
  const texture = useMemo(() => createArchitecturalTexture(), [])
  useEffect(() => () => texture.dispose(), [texture])

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[50, 64, 48]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} fog={false} toneMapped={false} />
    </mesh>
  )
}

function FloatingDust({ count = 160 }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 5 + Math.random() * 18
      const a = Math.random() * Math.PI * 2
      arr[i * 3] = Math.cos(a) * r
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10
      arr[i * 3 + 2] = Math.sin(a) * r
    }
    return arr
  }, [count])

  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.006
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#ffe8c8"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function Hotspot() {
  const ref = useRef()

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = -2.5 + Math.sin(state.clock.elapsedTime * 0.8) * 0.15
    }
  })

  return (
    <group ref={ref} position={[6, -2.5, -18]}>
      {/* Glow ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.7, 32]} />
        <meshBasicMaterial color="#fff" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
      {/* Center dot */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      {/* Pulse ring */}
      <PulseRing />
      {/* Label */}
      <Html center distanceFactor={15} style={{ pointerEvents: 'auto' }}>
        <Link
          to="/explore"
          className="group flex items-center gap-2 whitespace-nowrap rounded-full border border-white/20 bg-black/40 px-4 py-2 text-[13px] font-medium text-white/90 backdrop-blur-md transition-all hover:border-white/40 hover:bg-black/60 hover:text-white"
        >
          <span>Living Room</span>
          <svg
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </Html>
    </group>
  )
}

function PulseRing() {
  const ref = useRef()

  useFrame((state) => {
    if (ref.current) {
      const t = (Math.sin(state.clock.elapsedTime * 1.2) + 1) / 2
      ref.current.scale.setScalar(1 + t * 0.5)
      ref.current.material.opacity = 0.18 * (1 - t)
    }
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.55, 0.7, 32]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.18} side={THREE.DoubleSide} />
    </mesh>
  )
}

function SceneControls() {
  const ref = useRef()
  const idle = useRef()

  return (
    <OrbitControls
      ref={ref}
      makeDefault
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={-0.35}
      autoRotate
      autoRotateSpeed={0.25}
      minPolarAngle={Math.PI * 0.15}
      maxPolarAngle={Math.PI * 0.85}
      onStart={() => {
        window.clearTimeout(idle.current)
        if (ref.current) ref.current.autoRotate = false
      }}
      onEnd={() => {
        window.clearTimeout(idle.current)
        idle.current = window.setTimeout(() => {
          if (ref.current) ref.current.autoRotate = true
        }, 3500)
      }}
    />
  )
}

/* ─────────────────────────────────────────────
   Spatial UI indicators (HTML overlay)
   ───────────────────────────────────────────── */
function SpatialUI() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* Top-left: 360° badge */}
      <div className="absolute top-5 left-5 sm:top-7 sm:left-7">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60 backdrop-blur-sm">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          360°
        </div>
      </div>

      {/* Top-right: Enter indicator */}
      <div className="absolute top-5 right-5 sm:top-7 sm:right-7">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60 backdrop-blur-sm">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          Enter
        </div>
      </div>

      {/* Bottom-left: Drag hint */}
      <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60 backdrop-blur-sm">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 8 4.5 12l4 4" />
            <path d="m15.5 8 4 4-4 4" />
            <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
          </svg>
          Drag
        </div>
      </div>

      {/* Bottom-right: Explore badge */}
      <div className="absolute bottom-5 right-5 sm:bottom-7 sm:right-7">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60 backdrop-blur-sm">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Explore
        </div>
      </div>

      {/* Subtle corner vignette lines */}
      <div className="absolute top-4 left-4 h-8 w-px bg-gradient-to-b from-white/20 to-transparent sm:top-6 sm:left-6 sm:h-10" />
      <div className="absolute top-4 left-4 w-px bg-gradient-to-r from-white/20 to-transparent sm:top-6 sm:left-6 sm:w-10" />
      <div className="absolute right-4 top-4 h-8 w-px bg-gradient-to-b from-white/20 to-transparent sm:right-6 sm:top-6 sm:h-10" />
      <div className="absolute right-4 top-4 w-px bg-gradient-to-l from-white/20 to-transparent sm:right-6 sm:top-6 sm:w-10" />
      <div className="absolute bottom-4 left-4 h-8 w-px bg-gradient-to-t from-white/20 to-transparent sm:bottom-6 sm:left-6 sm:h-10" />
      <div className="absolute bottom-4 left-4 w-px bg-gradient-to-r from-white/20 to-transparent sm:bottom-6 sm:left-6 sm:w-10" />
      <div className="absolute bottom-4 right-4 h-8 w-px bg-gradient-to-t from-white/20 to-transparent sm:bottom-6 sm:right-6 sm:h-10" />
      <div className="absolute bottom-4 right-4 w-px bg-gradient-to-l from-white/20 to-transparent sm:bottom-6 sm:right-6 sm:w-10" />
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main Feature component
   ───────────────────────────────────────────── */
function Feature() {
  const sectionRef = useRef(null)
  const visualRef = useRef(null)
  const overlayTextRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const visual = visualRef.current
      const text = overlayTextRef.current

      gsap.fromTo(
        visual,
        { scale: 0.88, opacity: 0, rotateX: 8 },
        {
          scale: 1,
          opacity: 1,
          rotateX: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
            end: 'top 15%',
            scrub: 1,
          },
        }
      )

      gsap.fromTo(
        visual,
        { scale: 1 },
        {
          scale: 1.06,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'center center',
            end: 'bottom top',
            scrub: 1,
          },
        }
      )

      const layers = text.querySelectorAll('[data-speed]')
      layers.forEach((layer) => {
        const speed = parseFloat(layer.dataset.speed)
        gsap.fromTo(
          layer,
          { y: 50 * speed },
          {
            y: -30 * speed,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        )
      })

      gsap.fromTo(
        text,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'top 20%',
            scrub: 1,
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-base-100"
      style={{ perspective: '1200px' }}
    >
      <div className="relative mx-auto max-w-[1400px] px-5 py-24 sm:py-32 lg:py-40">
        {/* ── Panoramic Visual ── */}
        <div
          ref={visualRef}
          className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-base-200 shadow-2xl"
          style={{ transformOrigin: 'center center' }}
        >
          {/* 360° Canvas */}
          <div className="absolute inset-0">
            <Canvas
              camera={{ fov: 75, near: 0.1, far: 150, position: [0, 0, 0.01] }}
              dpr={[1, 1.75]}
              gl={{ antialias: true, powerPreference: 'high-performance' }}
              flat
            >
              <fog attach="fog" args={['#d8d2ca', 25, 60]} />
              <ArchSphere />
              <FloatingDust />
              <Hotspot />
              <SceneControls />
            </Canvas>
          </div>

          {/* Spatial UI overlays */}
          <SpatialUI />

          {/* Edge ring */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.04]" />
        </div>

        {/* ── Headline / Copy (parallax) ── */}
        <div
          ref={overlayTextRef}
          className="relative z-10 -mt-20 sm:-mt-28 lg:-mt-36 max-w-2xl px-2 sm:px-0"
        >
          <div data-speed="1.6">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.4em] text-base-content/40 sm:text-xs">
              The Product
            </span>
          </div>

          <h2
            data-speed="1"
            className="mt-4 text-[clamp(2rem,5vw,4.5rem)] leading-[1.04] text-base-content"
          >
            Not a photo.
            <br />
            <span className="text-base-content/40">
              A place you can explore.
            </span>
          </h2>

          <p
            data-speed="0.6"
            className="mt-6 max-w-lg text-sm leading-relaxed text-base-content/50 sm:text-base"
          >
            Every angle. Every room. Every detail — captured in full 360°.
            This isn't a gallery. It's a space waiting for you to step inside.
          </p>

          <div data-speed="0.4" className="mt-8">
            <Link
              to="/explore"
              className="[&>button]:px-7 [&>button]:py-2.5 [&>button]:text-[15px]"
            >
              <Button variant="primary">Explore a Space</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Feature
