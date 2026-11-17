"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Billboard, Html, OrbitControls, Stars, useTexture } from "@react-three/drei"
import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type MutableRefObject, type ReactNode } from "react"
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

const planetArtwork: Record<string, { src: string; crop: readonly [number, number, number, number] }> = {
  fashion: { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20261116_224031_Gallery-unQnLVZQuEK28YiBvCyy1oQoBg2VUf.jpg", crop: [0.02, 0.02, 0.96, 0.79] },
  media: { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20261116_224113_Gallery-8PdqEEw28UffN1eCIyzoA1sKdd9cfw.jpg", crop: [0.025, 0.02, 0.95, 0.83] },
  technology: { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20261116_224143_Gallery-Q5VgLwHJkQF2f2ho1PNuD6GFvYhRLg.jpg", crop: [0.02, 0.14, 0.96, 0.72] },
  wellness: { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20261116_224248_Gallery-ucbzUtzPyw2h0SM96eJIWRxT2qHGMc.jpg", crop: [0.06, 0.14, 0.88, 0.7] },
  hospitality: { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20261116_224019_Gallery-UFZfcNguyHNfVrhlnMGtK0KrgM8KXR.jpg", crop: [0.035, 0.07, 0.93, 0.79] },
  music: { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20261116_224058_Gallery-CgutCRvVSuJf7RnpOEsJrgToOgBb86.jpg", crop: [0.025, 0.02, 0.95, 0.71] },
  literature: { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20261116_224129_Gallery-nbmwriDgIoRluzZOnAllQQfPH7JX4j.jpg", crop: [0.035, 0.025, 0.93, 0.75] },
  community: { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20261116_224233_Gallery-8iqpXg0lrhTMh5xFi18VFVDALpTznA.jpg", crop: [0.03, 0.05, 0.94, 0.68] },
}
const artworkVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`
const artworkFragmentShader = `
uniform sampler2D uMap;
uniform vec3 uTint;
varying vec2 vUv;
void main() {
  vec3 artwork = texture2D(uMap, vUv).rgb;
  float radius = length((vUv - 0.5) * 2.0);
  float edge = 1.0 - smoothstep(0.91, 1.0, radius);
  vec3 color = mix(artwork, uTint, 0.28);
  gl_FragColor = vec4(color, edge * 0.88);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`

function PlanetArtwork({ venture }: { venture: Venture }) {
  const artwork = planetArtwork[venture.id]
  const source = useTexture(artwork.src)
  const [cropX, cropY, cropWidth, cropHeight] = artwork.crop
  const cropped = useMemo(() => {
    const texture = source.clone()
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.colorSpace = THREE.SRGBColorSpace
    texture.repeat.set(cropWidth, cropHeight)
    texture.offset.set(cropX, 1 - cropY - cropHeight)
    texture.needsUpdate = true
    return texture
  }, [source, cropX, cropY, cropWidth, cropHeight])
  useEffect(() => () => cropped.dispose(), [cropped])
  const uniforms = useMemo(() => ({ uMap: { value: cropped }, uTint: { value: new THREE.Color(venture.color) } }), [cropped, venture.color])
  return <Billboard>
    <mesh position={[0, 0, venture.size * 0.92]} renderOrder={1} raycast={() => {}}>
      <planeGeometry args={[venture.size * 1.78, venture.size * 1.56]} />
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

const coreStarVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`
const coreStarFragmentShader = `
varying vec2 vUv;
void main() {
  vec2 point = (vUv - 0.5) * 2.0;
  float radius = length(point);
  float horizontalRay = exp(-abs(point.x) * 46.0) * exp(-abs(point.y) * 3.2);
  float verticalRay = exp(-abs(point.y) * 46.0) * exp(-abs(point.x) * 3.2);
  float center = exp(-radius * 34.0);
  float bloom = exp(-radius * 4.6);
  float light = center + max(horizontalRay, verticalRay) * 0.84 + bloom * 0.2;
  vec3 color = mix(vec3(0.68, 0.42, 1.0), vec3(1.0, 0.91, 0.78), center);
  gl_FragColor = vec4(color, clamp(light, 0.0, 1.0));
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`

function CoreStar() {
  return <Billboard position={[0, 0.2, 0.88]}>
    <mesh renderOrder={2} raycast={() => {}}>
      <planeGeometry args={[1.45, 1.45]} />
      <shaderMaterial vertexShader={coreStarVertexShader} fragmentShader={coreStarFragmentShader} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </mesh>
  </Billboard>
}

function Core({ onReset }: { onReset: () => void }) {
  const core = useRef<THREE.Group>(null)
  useFrame(() => { if (core.current) core.current.rotation.y += 0.0016 })
  return <>
    <group ref={core} onClick={onReset}>
      <mesh><sphereGeometry args={[0.83, 44, 44]} /><meshStandardMaterial color="#f0a5a0" emissive="#e977a1" emissiveIntensity={1.2} metalness={0.25} roughness={0.28} /></mesh>
      <mesh scale={1.13}><sphereGeometry args={[0.83, 28, 28]} /><meshBasicMaterial color="#f28c68" transparent opacity={0.08} side={THREE.BackSide} /></mesh>
      <mesh scale={1.43} raycast={() => {}}><sphereGeometry args={[0.83, 36, 36]} /><meshBasicMaterial color="#9d5cff" transparent opacity={0.11} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
      <pointLight color="#e57aa9" intensity={5} distance={8} decay={2} />
    </group>
    <CoreStar />
    <Html center distanceFactor={8} position={[0, -0.13, 0.98]} style={{ pointerEvents: "none", whiteSpace: "nowrap" }}><div className="core-label"><span>NEVER FORGET TO DREAM</span><small>INCORPORATED</small></div></Html>
  </>
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

function VentureDrawer({ venture, index, onClose, onModeChange }: { venture: Venture; index: number; onClose: () => void; onModeChange: (mode: ViewMode) => void }) {
  const handleInternalLink = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return
    event.preventDefault()
    const target = href === "#" || href === "#explore" ? `#${venture.id}` : href
    onModeChange("standard")
    window.history.replaceState(null, "", target)
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => document.getElementById(target.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" })))
  }
  return <aside className="venture-drawer" key={venture.id} aria-labelledby="venture-title">
    <button className="drawer-close" onClick={onClose} aria-label="Return to Galaxy View"><X size={17} /></button>
    <p className="drawer-kicker"><span style={{ background: venture.color }} /> {venture.category}</p>
    <p className="drawer-number">{String(index + 1).padStart(2, "0")} <span>/ 08</span></p>
    <h2 id="venture-title">{venture.title}</h2><p className="drawer-tagline">{venture.tagline}</p>
    <div className="drawer-rule" /><p className="drawer-description">{venture.story}</p>
    <div className="drawer-projects"><span className="drawer-section-label">BRANDS IN THIS WORLD</span>{venture.moons.filter((moon) => moon.status !== "hidden").map((moon) => <div key={moon.id}><span><b>{moon.name}</b><small>{moon.status.replace("-", " ")}{moon.continents?.length ? ` · ${moon.continents.map((continent) => continent.title).join(", ")}` : ""}</small></span><ArrowUpRight size={14} /></div>)}</div>
    {venture.products?.some((product) => product.visible !== false) ? <div className="drawer-products"><span className="drawer-section-label">FEATURED IN THE SHOP</span>{venture.products.filter((product) => product.visible !== false).slice(0, 2).map((product) => <div key={product.name}><span>{product.name}<small>{product.category}</small></span><b>{product.price}</b></div>)}</div> : <div className="drawer-links">{venture.links.filter((link) => link.visible !== false).slice(0, 2).map((link) => <a key={link.label} href={link.href} onClick={(event) => handleInternalLink(event, link.href)} target={link.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{link.label}<ArrowUpRight size={12} /></a>)}</div>}
    <a className="launch-button" href={venture.href} onClick={(event) => handleInternalLink(event, venture.href)} target={venture.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"><span>{venture.cta.toUpperCase()}</span><ArrowUpRight size={16} /></a>
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
    {selected && <VentureDrawer venture={selected} index={ventures.findIndex((venture) => venture.id === selected.id)} onClose={resetView} onModeChange={onModeChange} />}
  </main>
}
