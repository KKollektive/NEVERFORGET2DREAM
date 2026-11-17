"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Billboard, Html, OrbitControls, Stars, useTexture } from "@react-three/drei"
import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type MutableRefObject, type ReactNode } from "react"
import * as THREE from "three"
import { ArrowDownLeft, ArrowUpRight, ChevronDown, Compass, Move3D, Sparkles, X } from "lucide-react"
import type { Venture } from "../data/ecosystem"
import { ModeSelector, type ViewMode } from "./mode-selector"

function Orbit({ venture, active }: { venture: Venture; active: boolean }) {
  const geometry = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, venture.radius, venture.radius * 0.64, 0, Math.PI * 2)
    return new THREE.BufferGeometry().setFromPoints(curve.getPoints(120).map((point) => new THREE.Vector3(point.x, 0, point.y)))
  }, [venture.radius])
  useEffect(() => () => geometry.dispose(), [geometry])
  return <lineLoop geometry={geometry}><lineBasicMaterial color={venture.color} transparent opacity={active ? 0.66 : 0.19} /></lineLoop>
}

function OrbitClock({ orbitTime, paused }: { orbitTime: MutableRefObject<number>; paused: boolean }) {
  useFrame((_, delta) => { if (!paused) orbitTime.current += delta })
  return null
}

const PLANET_ARTWORK_URL = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20261115_111710_ChatGPT-Qnm8nXYr5wK8AZZm9C73UEGhcXQfU0.jpg"
const artworkVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`
const artworkFragmentShader = `
uniform sampler2D uMap;
varying vec2 vUv;
void main() {
  vec4 pixel = texture2D(uMap, vUv);
  vec3 background = texture2D(uMap, vec2(0.01, 0.01)).rgb;
  float separation = distance(pixel.rgb, background);
  float alpha = smoothstep(0.028, 0.15, separation);
  float edge = smoothstep(0.0, 0.035, min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y)));
  gl_FragColor = vec4(pixel.rgb, alpha * edge * 0.98);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`

function PlanetArtwork({ venture }: { venture: Venture }) {
  const source = useTexture(PLANET_ARTWORK_URL)
  const cropped = useMemo(() => {
    const texture = source.clone()
    const column = (venture.order - 1) % 4
    const row = Math.floor((venture.order - 1) / 4)
    const cropHeight = 0.37
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.colorSpace = THREE.SRGBColorSpace
    texture.repeat.set(0.25, cropHeight)
    texture.offset.set(column * 0.25, 1 - (row * 0.5 + cropHeight))
    texture.needsUpdate = true
    return texture
  }, [source, venture.order])
  useEffect(() => () => cropped.dispose(), [cropped])
  const uniforms = useMemo(() => ({ uMap: { value: cropped } }), [cropped])
  return <Billboard>
    <mesh position={[0, 0, venture.size * 0.92]} renderOrder={1} raycast={() => {}}>
      <planeGeometry args={[venture.size * 2.08, venture.size * 1.69]} />
      <shaderMaterial uniforms={uniforms} vertexShader={artworkVertexShader} fragmentShader={artworkFragmentShader} transparent depthWrite={false} />
    </mesh>
  </Billboard>
}

function Planet({ venture, onSelect, selectedId, orbitTime }: { venture: Venture; onSelect: (venture: Venture) => void; selectedId?: string; orbitTime: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null)
  const mesh = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const selected = selectedId === venture.id
  useFrame(({ clock }) => {
    const time = orbitTime.current * venture.speed + venture.phase
    if (group.current) group.current.position.set(Math.cos(time) * venture.radius, Math.sin(time * 1.6) * 0.12, Math.sin(time) * venture.radius * 0.64)
    if (mesh.current) {
      const scale = hovered || selected ? 1.16 : 1
      mesh.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.12)
      mesh.current.rotation.y += 0.003
    }
  })
  return <>
    <Orbit venture={venture} active={hovered || selected} />
    <group ref={group}>
      <mesh ref={mesh} onClick={(event) => { event.stopPropagation(); onSelect(venture) }} onPointerOver={(event) => { event.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer" }} onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto" }}>
        <sphereGeometry args={[venture.size, 48, 48]} />
        <meshStandardMaterial color={venture.color} emissive={venture.color} emissiveIntensity={hovered || selected ? 0.95 : 0.32} roughness={0.3} metalness={0.24} />
      </mesh>
      <PlanetArtwork venture={venture} />
      <mesh scale={1.17}>
        <sphereGeometry args={[venture.size, 32, 32]} />
        <meshBasicMaterial color={venture.color} transparent opacity={0.075} side={THREE.BackSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2.35, 0.18, 0.22]}>
        <torusGeometry args={[venture.size * 1.34, Math.max(0.012, venture.size * 0.055), 8, 72]} />
        <meshBasicMaterial color={venture.color} transparent opacity={0.78} />
      </mesh>
      <mesh rotation={[Math.PI / 2.15, -0.3, -0.14]}>
        <torusGeometry args={[venture.size * 1.58, Math.max(0.006, venture.size * 0.018), 6, 72]} />
        <meshBasicMaterial color="#e2d4f0" transparent opacity={0.5} />
      </mesh>
      <pointLight color={venture.color} intensity={hovered ? 0.8 : 0.22} distance={2.2} />
      <Html center distanceFactor={11} position={[0, venture.size + 0.3, 0]} style={{ pointerEvents: "none", whiteSpace: "nowrap" }}><span className={`planet-label ${hovered || selected ? "planet-label-active" : ""}`}>{venture.shortTitle}</span></Html>
    </group>
  </>
}

function Core({ onReset }: { onReset: () => void }) {
  const core = useRef<THREE.Group>(null)
  useFrame(() => { if (core.current) core.current.rotation.y += 0.0016 })
  return <group ref={core} onClick={onReset}>
    <mesh><sphereGeometry args={[0.83, 44, 44]} /><meshStandardMaterial color="#f0a5a0" emissive="#e977a1" emissiveIntensity={1.2} metalness={0.25} roughness={0.28} /></mesh>
    <mesh scale={1.13}><sphereGeometry args={[0.83, 28, 28]} /><meshBasicMaterial color="#f28c68" transparent opacity={0.08} side={THREE.BackSide} /></mesh>
    <pointLight color="#e57aa9" intensity={5} distance={8} decay={2} />
    <Html center distanceFactor={8} position={[0, 1.34, 0]} style={{ pointerEvents: "none", whiteSpace: "nowrap" }}><div className="core-label"><span>NEVER FORGET TO DREAM</span><small>INCORPORATED</small></div></Html>
  </group>
}

function CameraDirector({ selected, orbitTime }: { selected: Venture | null; orbitTime: MutableRefObject<number> }) {
  const { camera } = useThree()
  const controls = useRef<any>(null)
  const targetPosition = useRef(new THREE.Vector3(0, 7.6, 14))
  const targetFocus = useRef(new THREE.Vector3(0, 0, 0))
  useEffect(() => { if (!selected) { targetPosition.current.set(0, 7.6, 14); targetFocus.current.set(0, 0, 0) } }, [selected])
  useFrame(({ clock }) => {
    if (selected) {
      const time = orbitTime.current * selected.speed + selected.phase
      const x = Math.cos(time) * selected.radius
      const z = Math.sin(time) * selected.radius * 0.64
      targetFocus.current.set(x, 0, z)
      targetPosition.current.set(x + 2.6, 2.25, z + 4.3)
    }
    camera.position.lerp(targetPosition.current, selected ? 0.035 : 0.025)
    if (controls.current) { controls.current.target.lerp(targetFocus.current, 0.035); controls.current.update() }
  })
  return <OrbitControls ref={controls} makeDefault enableDamping dampingFactor={0.055} minDistance={6} maxDistance={24} maxPolarAngle={Math.PI * 0.83} minPolarAngle={Math.PI * 0.12} />
}

function GalaxyScene({ ventures, selected, onSelect, onReset, orbitPaused }: { ventures: Venture[]; selected: Venture | null; onSelect: (venture: Venture) => void; onReset: () => void; orbitPaused: boolean }) {
  const orbitTime = useRef(0)
  return <Canvas camera={{ position: [0, 7.6, 14], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
    <fog attach="fog" args={["#0b0719", 17, 37]} /><ambientLight intensity={0.52} />
    <Stars radius={75} depth={55} count={1900} factor={3} saturation={0.3} fade speed={0.28} /><Core onReset={onReset} /><OrbitClock orbitTime={orbitTime} paused={orbitPaused} />
    {ventures.map((venture) => <Planet key={venture.id} venture={venture} onSelect={onSelect} selectedId={selected?.id} orbitTime={orbitTime} />)}
    <CameraDirector selected={selected} orbitTime={orbitTime} />
  </Canvas>
}

function VentureDrawer({ venture, index, onClose }: { venture: Venture; index: number; onClose: () => void }) {
  return <aside className="venture-drawer" key={venture.id} aria-labelledby="venture-title">
    <button className="drawer-close" onClick={onClose} aria-label="Return to Galaxy View"><X size={17} /></button>
    <p className="drawer-kicker"><span style={{ background: venture.color }} /> {venture.category}</p>
    <p className="drawer-number">{String(index + 1).padStart(2, "0")} <span>/ 08</span></p>
    <h2 id="venture-title">{venture.title}</h2><p className="drawer-tagline">{venture.tagline}</p>
    <div className="drawer-rule" /><p className="drawer-description">{venture.story}</p>
    <div className="drawer-projects"><span className="drawer-section-label">BRANDS IN THIS WORLD</span>{venture.moons.filter((moon) => moon.status !== "hidden").map((moon) => <div key={moon.id}><span><b>{moon.name}</b><small>{moon.status.replace("-", " ")}{moon.continents?.length ? ` · ${moon.continents.map((continent) => continent.title).join(", ")}` : ""}</small></span><ArrowUpRight size={14} /></div>)}</div>
    {venture.products?.some((product) => product.visible !== false) ? <div className="drawer-products"><span className="drawer-section-label">FEATURED IN THE SHOP</span>{venture.products.filter((product) => product.visible !== false).slice(0, 2).map((product) => <div key={product.name}><span>{product.name}<small>{product.category}</small></span><b>{product.price}</b></div>)}</div> : <div className="drawer-links">{venture.links.filter((link) => link.visible !== false).slice(0, 2).map((link) => <a key={link.label} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{link.label}<ArrowUpRight size={12} /></a>)}</div>}
    <a className="launch-button" href={venture.href} target={venture.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"><span>{venture.cta.toUpperCase()}</span><ArrowUpRight size={16} /></a>
    <button className="return-button" onClick={onClose}><ArrowDownLeft size={14} /> RETURN TO GALAXY</button>
    <span className="drawer-index">NEVER FORGET TO DREAM INC.</span>
  </aside>
}

class SceneErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode; onError: () => void }, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

function GalaxyFallback({ ventures, onSelect, onStandardMode }: { ventures: Venture[]; onSelect: (venture: Venture) => void; onStandardMode: () => void }) {
  return <section className="galaxy-fallback" aria-label="Explore the dream worlds"><p className="fallback-kicker">A UNIVERSE OF IDEAS</p><h2>Choose a world<br /><em>to explore.</em></h2><p className="fallback-copy">This device can&apos;t render the 3D galaxy, but every world is still here.</p><div className="fallback-worlds">{ventures.map((venture, index) => <button key={venture.id} onClick={() => onSelect(venture)} style={{ backgroundImage: `linear-gradient(0deg, rgba(5,3,10,.82), transparent 65%), url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20261115_111710_ChatGPT-gFX36yNxELdD27MFRwza56MKh1AnXw.jpg)`, backgroundSize: `cover, 400% 200%`, backgroundPosition: `center, ${(index % 4) * 33.333}% ${Math.floor(index / 4) * 100}%` }}><i style={{ background: venture.color }} /><span>{venture.shortTitle}</span><ArrowUpRight size={13} /></button>)}</div><button className="fallback-standard" onClick={onStandardMode}>Open Standard Site <ArrowUpRight size={13} /></button></section>
}

export function GalaxyExperience({ ventures, onModeChange }: { ventures: Venture[]; onModeChange: (mode: ViewMode) => void }) {
  const [selected, setSelected] = useState<Venture | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sceneFailed, setSceneFailed] = useState(false)
  const [orbitPaused, setOrbitPaused] = useState(false)
  const selectVenture = useCallback((venture: Venture) => { setSelected(venture); setMenuOpen(false) }, [])
  const resetView = useCallback(() => setSelected(null), [])
  return <main className={`galaxy-shell${sceneFailed ? " galaxy-shell-fallback" : ""}`}>
    <div className="nebula nebula-one" /><div className="nebula nebula-two" /><div className="grain" />
    <div className="scene-wrap"><SceneErrorBoundary onError={() => setSceneFailed(true)} fallback={<GalaxyFallback ventures={ventures} onSelect={selectVenture} onStandardMode={() => onModeChange("standard")} />}><Suspense fallback={null}><GalaxyScene ventures={ventures} selected={selected} onSelect={selectVenture} onReset={resetView} orbitPaused={orbitPaused} /></Suspense></SceneErrorBoundary></div>
    <header className="hud-header">
      <a className="brand-mark" href="#home" onClick={(event) => { event.preventDefault(); resetView() }} aria-label="Never Forget to Dream home"><span className="brand-symbol"><Sparkles size={18} strokeWidth={1.5} /></span><span className="brand-name">NEVER FORGET<span>TO DREAM INC.</span></span></a>
      <div className="header-actions"><div className="nav-wrap"><button className="nav-pill" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-haspopup="true"><Compass size={15} /> <span>EXPLORE WORLDS</span><ChevronDown size={14} className={menuOpen ? "chevron-up" : ""} /></button>
      {menuOpen && <div className="quick-menu">{ventures.map((venture) => <button key={venture.id} onClick={() => selectVenture(venture)}><span className="menu-dot" style={{ background: venture.color }} />{venture.shortTitle}<ArrowUpRight size={13} /></button>)}</div>}</div>
      <div className="mode-switch" aria-label="Site view"><ModeSelector currentMode="galaxy" onModeChange={onModeChange} variant="galaxy" /></div></div>
    </header>
    <div className="hero-copy" aria-hidden={selected ? "true" : undefined}><p className="eyebrow"><span /> A UNIVERSE OF IDEAS</p><h1>Every dream<br />has <em>a world.</em></h1><p className="hero-subtitle">A constellation of things we&apos;re building, making, and dreaming into being.</p><div className="hero-hint"><Move3D size={14} strokeWidth={1.6} /><span>DRAG TO EXPLORE</span><i /> <span>SELECT A WORLD</span></div></div>
    <div className="scene-caption"><span className="caption-line" /> THE NEVER FORGET UNIVERSE <span className="caption-index">01 — 08</span></div>
    <div className="accessible-jump" aria-label="Choose a world"><button className="orbit-toggle" onClick={() => setOrbitPaused((paused) => !paused)} aria-pressed={orbitPaused}>{orbitPaused ? "RESUME ORBIT" : "PAUSE ORBIT"}</button><span>CHOOSE A WORLD</span>{ventures.map((venture, index) => <button key={venture.id} className={`jump-world${selected?.id === venture.id ? " jump-active" : ""}`} style={{ "--planet-color": venture.color } as CSSProperties} onClick={() => selectVenture(venture)} aria-label={`Explore ${venture.title}`}><i />{String(index + 1).padStart(2, "0")} · {venture.shortTitle}</button>)}</div>
    <div className="footer-note"><span className="live-dot" /> EIGHT WORLDS, ONE DREAM <span className="footer-divider">/</span><a href="/back-office">FOUNDER PORTAL</a></div>
    {selected && <VentureDrawer venture={selected} index={ventures.findIndex((venture) => venture.id === selected.id)} onClose={resetView} />}
  </main>
}
