"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Billboard, Html, OrbitControls, Stars, useTexture } from "@react-three/drei"
import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type MutableRefObject, type ReactNode } from "react"
import Link from "next/link"
import * as THREE from "three"
import { ArrowDownLeft, ArrowUpRight, ChevronDown, Compass, Move3D, Pause, Play, Sparkles, Volume2, VolumeX, X } from "lucide-react"
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
  fashion: { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20261116_224031_Gallery-unQnLVZQuEK28YiBvCyy1oQoBg2VUf.jpg", crop: [0.02, 0.02, 0.96, 0.75] },
  media: { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20261116_224113_Gallery-8PdqEEw28UffN1eCIyzoA1sKdd9cfw.jpg", crop: [0.025, 0.02, 0.95, 0.71] },
  technology: { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20261116_224143_Gallery-Q5VgLwHJkQF2f2ho1PNuD6GFvYhRLg.jpg", crop: [0.02, 0.14, 0.96, 0.72] },
  wellness: { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20261116_224248_Gallery-ucbzUtzPyw2h0SM96eJIWRxT2qHGMc.jpg", crop: [0.06, 0.14, 0.88, 0.66] },
  hospitality: { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20261116_224019_Gallery-UFZfcNguyHNfVrhlnMGtK0KrgM8KXR.jpg", crop: [0.035, 0.07, 0.93, 0.79] },
  music: { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20261116_224058_Gallery-CgutCRvVSuJf7RnpOEsJrgToOgBb86.jpg", crop: [0.025, 0.02, 0.95, 0.68] },
  literature: { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20261116_224129_Gallery-nbmwriDgIoRluzZOnAllQQfPH7JX4j.jpg", crop: [0.035, 0.025, 0.93, 0.75] },
  community: { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20261116_224233_Gallery-8iqpXg0lrhTMh5xFi18VFVDALpTznA.jpg", crop: [0.03, 0.05, 0.94, 0.65] },
}

type DivisionExperience = { featuredLabel: string; featuredTitle: string; featuredCopy: string; previewTitle: string; lore: string; actionLabel: string; actionHref: string }

const divisionExperience: Record<string, DivisionExperience> = {
  fashion: { featuredLabel: "FEATURED LOOKBOOK", featuredTitle: "Dusk Theory · The Atelier Edit", featuredCopy: "Silk-magenta silhouettes and healing armor made for the life you are becoming.", previewTitle: "KOUT ATELIER™ lookbook", lore: "A world of expressive design, wearable confidence, and new forms of healing armor.", actionLabel: "Explore Lookbook", actionHref: "#fashion" },
  media: { featuredLabel: "LATEST EPISODE", featuredTitle: "Kristeanna’s Korner", featuredCopy: "A warm, honest journal of the ideas, rituals, and everyday moments that make a life feel like your own.", previewTitle: "Kristeanna’s Korner on YouTube", lore: "A living constellation of video journals, series, reactions, and community-led storytelling.", actionLabel: "Visit Kristeanna’s Korner on YouTube", actionHref: "https://youtube.com/@kristeannaskorner?si=f9MGnYG-pwsAFl4Y" },
  technology: { featuredLabel: "FEATURED PLATFORM", featuredTitle: "AI Rolodex · Creative Tools", featuredCopy: "A considered guide to the tools helping people make room for more human imagination.", previewTitle: "AI Rolodex preview", lore: "Thoughtful technology and creative platforms built to make the next idea easier to reach.", actionLabel: "Explore AI Rolodex", actionHref: "#technology" },
  wellness: { featuredLabel: "FEATURED RITUAL", featuredTitle: "The Siptionary · A Pause in Bloom", featuredCopy: "A small invitation to slow down, find the words for what you feel, and begin again.", previewTitle: "Wellness experience preview", lore: "Tea, reflection, and practical rituals for personal growth and the next becoming.", actionLabel: "Explore Wellness", actionHref: "#wellness" },
  hospitality: { featuredLabel: "FEATURED DROP", featuredTitle: "That’s The Tea · Sunday in Bloom", featuredCopy: "A softly bright botanical ritual for a little everyday renewal, poured with a touch of luxury.", previewTitle: "Tea and lifestyle preview", lore: "Comforting flavors, thoughtful hospitality, and luxurious rituals for everyday dreaming.", actionLabel: "Discover the Tea Menu", actionHref: "#hospitality" },
  music: { featuredLabel: "FEATURED RELEASE", featuredTitle: "K. Reverie · Playing in the Flowers", featuredCopy: "Original music and visual poetry for the feelings that stay with you after the last note.", previewTitle: "K. Reverie on YouTube", lore: "A velvet-curtain soundscape for original music, choreography, and performance art.", actionLabel: "Visit K. Reverie on YouTube", actionHref: "https://youtube.com/@k.reverie?si=6KbvH7RzRULgb1Bh" },
  literature: { featuredLabel: "FEATURED STORY", featuredTitle: "The Writings · HEIRS, Chapter 1", featuredCopy: "Step into the first page of a growing story universe, built to reward every curious reader.", previewTitle: "Read a story preview", lore: "Original novels, poetry, film, and story quests gathered beneath a moonlit citadel.", actionLabel: "Read Chapter 1", actionHref: "#literature" },
  community: { featuredLabel: "FEATURED INITIATIVE", featuredTitle: "Reverie 1 Nation · The First Gathering", featuredCopy: "Creative confidence, mentorship, and possibility grow stronger when more people can dream together.", previewTitle: "Community impact preview", lore: "A tree-of-life world for mentorship, creative development, and community possibility.", actionLabel: "Explore Community Impact", actionHref: "#community" },
}

type AmbientSynth = { context: AudioContext; master: GainNode; oscillators: OscillatorNode[] }

const artworkVertexShader = `
varying vec3 vPlanetPosition;
varying vec3 vPlanetNormal;
void main() {
  vPlanetPosition = position;
  vPlanetNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`
const artworkFragmentShader = `
uniform sampler2D uMap;
uniform vec3 uTint;
uniform float uRadius;
varying vec3 vPlanetPosition;
varying vec3 vPlanetNormal;
void main() {
  if (vPlanetPosition.z <= 0.0) discard;
  vec2 imageUv = vPlanetPosition.xy / (uRadius * 2.0) + 0.5;
  float radius = length((imageUv - 0.5) * 2.0);
  if (radius > 1.0) discard;
  vec3 artwork = texture2D(uMap, imageUv).rgb;
  float luminance = dot(artwork, vec3(0.2126, 0.7152, 0.0722));
  float artworkMask = smoothstep(0.018, 0.11, luminance);
  float edgeMask = 1.0 - smoothstep(0.94, 1.0, radius);
  vec3 normal = normalize(vPlanetNormal);
  vec3 lightDirection = normalize(vec3(-0.38, 0.52, 0.78));
  float diffuse = 0.42 + max(dot(normal, lightDirection), 0.0) * 0.7;
  float rim = pow(1.0 - max(normal.z, 0.0), 2.4);
  float specular = pow(max(dot(reflect(-lightDirection, normal), vec3(0.0, 0.0, 1.0)), 0.0), 24.0);
  vec3 color = mix(uTint, artwork, 0.86) * diffuse + uTint * rim * 0.3 + vec3(1.0, 0.82, 0.72) * specular * 0.42;
  float opacity = artworkMask * edgeMask * 0.96;
  gl_FragColor = vec4(color, opacity);
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
  const radius = venture.size * 1.008
  const uniforms = useMemo(() => ({ uMap: { value: cropped }, uTint: { value: new THREE.Color(venture.color) }, uRadius: { value: radius } }), [cropped, venture.color, radius])
  return <mesh renderOrder={1} raycast={() => {}}>
    <sphereGeometry args={[radius, 48, 48]} />
    <shaderMaterial uniforms={uniforms} vertexShader={artworkVertexShader} fragmentShader={artworkFragmentShader} transparent depthWrite={false} />
  </mesh>
}

function Planet({ venture, onSelect, selectedId, activeId, orbitTime }: { venture: Venture; onSelect: (venture: Venture) => void; selectedId?: string; activeId?: string; orbitTime: MutableRefObject<number> }) {
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
        <PlanetArtwork venture={venture} />
      </mesh>
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
      <Html center distanceFactor={11} position={[0, venture.size + 0.3, 0]} style={{ pointerEvents: "none", whiteSpace: "nowrap" }}><span className={`planet-label ${hovered || selected || activeId === venture.id ? "planet-label-active" : ""}`}>{venture.shortTitle}</span></Html>
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
      <mesh><sphereGeometry args={[0.83, 64, 64]} /><meshStandardMaterial color="#f0a5a0" emissive="#e977a1" emissiveIntensity={1.2} metalness={0.25} roughness={0.28} /></mesh>
      <mesh scale={1.13}><sphereGeometry args={[0.83, 36, 36]} /><meshBasicMaterial color="#f28c68" transparent opacity={0.13} side={THREE.BackSide} /></mesh>
      <mesh rotation={[Math.PI / 2.5, 0.18, 0.36]}><torusGeometry args={[1.08, 0.026, 8, 96]} /><meshBasicMaterial color="#f4b18e" transparent opacity={0.82} /></mesh>
      <mesh rotation={[Math.PI / 2.7, -0.28, -0.12]}><torusGeometry args={[1.29, 0.012, 6, 96]} /><meshBasicMaterial color="#9d73e8" transparent opacity={0.68} /></mesh>
      <mesh scale={1.43} raycast={() => {}}><sphereGeometry args={[0.83, 36, 36]} /><meshBasicMaterial color="#9d5cff" transparent opacity={0.16} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
      <pointLight color="#e57aa9" intensity={5} distance={8} decay={2} />
    </group>
    <CoreStar />
    <Html center distanceFactor={8} position={[0, -0.13, 0.98]} style={{ pointerEvents: "none", whiteSpace: "nowrap" }}><div className="core-label"><span>NEVER FORGET TO DREAM</span><small>INCORPORATED</small></div></Html>
  </>
}

function CameraDirector({ selected, tourTarget, manualControl, orbitTime, onManualControl }: { selected: Venture | null; tourTarget: Venture | null; manualControl: boolean; orbitTime: MutableRefObject<number>; onManualControl: () => void }) {
  const { camera } = useThree()
  const controls = useRef<any>(null)
  const targetPosition = useRef(new THREE.Vector3(0, 7.6, 14))
  const targetFocus = useRef(new THREE.Vector3(0, 0, 0))
  const focus = selected ?? tourTarget
  useEffect(() => {
    if (!focus && !manualControl) {
      targetPosition.current.set(0, 7.6, 14)
      targetFocus.current.set(0, 0, 0)
    }
  }, [focus, manualControl])
  useFrame(() => {
    if (focus && !manualControl) {
      const time = orbitTime.current * focus.speed + focus.phase
      const x = Math.cos(time) * focus.radius
      const z = Math.sin(time) * focus.radius * 0.64
      targetFocus.current.set(x, 0, z)
      targetPosition.current.set(x + (selected ? 2.6 : 5.2), selected ? 2.25 : 4.1, z + (selected ? 4.3 : 8.2))
    }
    if (!manualControl) {
      camera.position.lerp(targetPosition.current, focus ? 0.055 : 0.025)
      if (controls.current) controls.current.target.lerp(targetFocus.current, 0.055)
    }
    if (controls.current) controls.current.update()
  })
  return <OrbitControls ref={controls} makeDefault enableDamping dampingFactor={0.055} minDistance={4} maxDistance={24} maxPolarAngle={Math.PI * 0.83} minPolarAngle={Math.PI * 0.12} onStart={onManualControl} />
}

function GalaxyScene({ ventures, selected, tourTarget, manualControl, onManualControl, onSelect, onReset, orbitPaused }: { ventures: Venture[]; selected: Venture | null; tourTarget: Venture | null; manualControl: boolean; onManualControl: () => void; onSelect: (venture: Venture) => void; onReset: () => void; orbitPaused: boolean }) {
  const orbitTime = useRef(0)
  return <Canvas camera={{ position: [0, 7.6, 14], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
    <fog attach="fog" args={["#0b0719", 17, 37]} /><ambientLight intensity={0.52} />
    <Stars radius={75} depth={55} count={1900} factor={3} saturation={0.3} fade speed={0.28} /><Core onReset={onReset} /><OrbitClock orbitTime={orbitTime} paused={orbitPaused} />
    {ventures.map((venture) => <Planet key={venture.id} venture={venture} onSelect={onSelect} selectedId={selected?.id} activeId={tourTarget?.id} orbitTime={orbitTime} />)}
    <CameraDirector selected={selected} tourTarget={tourTarget} manualControl={manualControl} orbitTime={orbitTime} onManualControl={onManualControl} />
  </Canvas>
}

function VentureDrawer({ venture, index, onClose, onModeChange }: { venture: Venture; index: number; onClose: () => void; onModeChange: (mode: ViewMode) => void }) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const experience = divisionExperience[venture.id]
  const artwork = planetArtwork[venture.id]
  const [cropX, cropY, cropWidth, cropHeight] = artwork.crop
  const featuredProduct = venture.products?.find((product) => product.visible !== false)
  const liveCount = venture.moons.filter((moon) => moon.status === "live").length
  const upcomingCount = venture.moons.filter((moon) => moon.status === "new" || moon.status === "coming-soon").length
  const collectionCount = (venture.albums?.length ?? 0) + (venture.continents?.length ?? 0)
  const externalAction = experience.actionHref.startsWith("https://")
  const handleInternalLink = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return
    event.preventDefault()
    const target = href === "#" || href === "#explore" ? `#${venture.id}` : href
    onModeChange("standard")
    window.history.replaceState(null, "", target)
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => document.getElementById(target.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" })))
  }
  return <aside className="venture-drawer" aria-labelledby="venture-title">
    <button className="drawer-close" onClick={onClose} aria-label="Return to Galaxy View"><X size={17} /></button>
    <div className="drawer-world-art" role="img" aria-label={`${venture.title} world artwork`}>
      <img src={artwork.src} alt="" style={{ width: `${100 / cropWidth}%`, height: `${100 / cropHeight}%`, left: `${(-cropX / cropWidth) * 100}%`, top: `${(-cropY / cropHeight) * 100}%` }} />
      <span>{String(index + 1).padStart(2, "0")} / 08</span>
    </div>
    <p className="drawer-kicker"><span style={{ background: venture.color }} /> {venture.category}</p>
    <p className="drawer-number">{String(index + 1).padStart(2, "0")} <span>/ 08</span></p>
    <h2 id="venture-title">{venture.title}</h2><p className="drawer-tagline">{venture.tagline}</p>
    <div className="drawer-rule" />
    <section className="drawer-feature" aria-label="Featured drop or release">
      <div className="drawer-feature-top"><span>{featuredProduct ? "FEATURED DROP" : experience.featuredLabel}</span><Sparkles size={14} /></div>
      <h3>{featuredProduct?.name ?? experience.featuredTitle}</h3>
      <p>{featuredProduct?.details ?? experience.featuredCopy}</p>
    </section>
    <section className="drawer-preview" aria-labelledby="preview-heading">
      <div className="drawer-section-heading"><span id="preview-heading">INTERACTIVE PREVIEW</span><span>EMBED READY</span></div>
      {externalAction ? (
        <a className="media-preview" href={experience.actionHref} target="_blank" rel="noopener noreferrer">
          <span className="media-preview-play"><Play size={15} fill="currentColor" /></span>
          <span className="media-preview-copy"><b>{experience.previewTitle}</b><small>{venture.id === "music" ? "Listen on K. Reverie’s YouTube channel." : "Watch the latest videos on YouTube."}</small></span>
          <ArrowUpRight size={15} />
        </a>
      ) : (
        <button className="media-preview" type="button" aria-expanded={previewOpen} onClick={() => setPreviewOpen((open) => !open)}>
          <span className="media-preview-play"><Play size={15} fill="currentColor" /></span>
          <span className="media-preview-copy"><b>{experience.previewTitle}</b><small>{previewOpen ? "Preview slot ready for the official media embed." : "Tap to open the interactive preview space."}</small></span>
          <ArrowUpRight size={15} />
        </button>
      )}
    </section>
    <section className="drawer-lore" aria-labelledby="lore-heading">
      <span className="drawer-section-label" id="lore-heading">QUICK STATS / LORE</span>
      <div className="drawer-stats"><div><b>{String(liveCount).padStart(2, "0")}</b><span>Live moons</span></div><div><b>{String(upcomingCount).padStart(2, "0")}</b><span>In orbit</span></div><div><b>{String(collectionCount).padStart(2, "0")}</b><span>Collections</span></div></div>
      <p>{experience.lore}</p>
    </section>
    <div className="drawer-projects"><span className="drawer-section-label">BRANDS IN THIS WORLD</span>{venture.moons.filter((moon) => moon.status !== "hidden").slice(0, 4).map((moon) => <div key={moon.id}><span><b>{moon.name}</b><small>{moon.status.replace("-", " ")}{moon.continents?.length ? ` · ${moon.continents.map((continent) => continent.title).join(", ")}` : ""}</small></span><ArrowUpRight size={14} /></div>)}{venture.links?.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"><span><b>{link.label}</b><small>Open social channel</small></span><ArrowUpRight size={14} /></a>)}</div>
    <Link className="launch-button" href={experience.actionHref} target={externalAction ? "_blank" : undefined} rel={externalAction ? "noopener noreferrer" : undefined} onClick={(event) => handleInternalLink(event, experience.actionHref)}><span>{experience.actionLabel.toUpperCase()}</span><ArrowUpRight size={16} /></Link>
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

function WelcomeOverlay({ onEnter, onTour }: { onEnter: () => void; onTour: () => void }) {
  return <div className="welcome-overlay">
    <section className="welcome-card" role="dialog" aria-modal="true" aria-labelledby="welcome-title" aria-describedby="welcome-description">
      <div className="welcome-orbit" aria-hidden="true"><span /><span /><i /></div>
      <p className="welcome-kicker"><span /> NEVER FORGET TO DREAM INC.</p>
      <h2 id="welcome-title">A universe<br />of <em>possibility.</em></h2>
      <p className="welcome-description" id="welcome-description">Eight worlds, one living constellation. Find the stories, ideas, and people bringing every dream to life.</p>
      <div className="welcome-actions">
        <button className="welcome-primary" onClick={onEnter}>Enter the Universe <ArrowUpRight size={16} /></button>
        <button className="welcome-secondary" onClick={onTour}><Play size={13} fill="currentColor" /> Take Guided Tour</button>
      </div>
      <span className="welcome-footnote">A LITTLE WONDER GOES A LONG WAY</span>
    </section>
  </div>
}

function TourGuide({ stop, total, title, description, paused, onTogglePause, onTakeControl }: { stop: number; total: number; title: string; description: string; paused: boolean; onTogglePause: () => void; onTakeControl: () => void }) {
  return <aside className="tour-guide" aria-label="Guided tour stop" aria-live="polite">
    <div className="tour-progress"><span>GUIDED FLIGHT</span><span>{String(stop).padStart(2, "0")} / {String(total).padStart(2, "0")}</span></div>
    <div className="tour-heading"><span className="tour-compass"><Compass size={16} /></span><div><p>NOW VISITING</p><h2>{title}</h2></div></div>
    <p className="tour-description">{description}</p>
    <div className="tour-actions">
      <button onClick={onTogglePause} aria-pressed={paused}>{paused ? <Play size={13} fill="currentColor" /> : <Pause size={13} />} {paused ? "RESUME TOUR" : "PAUSE TOUR"}</button>
      <button onClick={onTakeControl}><Move3D size={13} /> TAKE MANUAL CONTROL</button>
    </div>
  </aside>
}

export function GalaxyExperience({ ventures, onModeChange }: { ventures: Venture[]; onModeChange: (mode: ViewMode) => void }) {
  const [selected, setSelected] = useState<Venture | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sceneFailed, setSceneFailed] = useState(false)
  const [orbitPaused, setOrbitPaused] = useState(false)
  const [welcomeOpen, setWelcomeOpen] = useState(true)
  const [tourIndex, setTourIndex] = useState<number | null>(null)
  const [tourPaused, setTourPaused] = useState(false)
  const [manualControl, setManualControl] = useState(false)
  const [ambientOn, setAmbientOn] = useState(false)
  const ambientRef = useRef<AmbientSynth | null>(null)
  const selectVenture = useCallback((venture: Venture) => {
    setSelected(venture)
    setMenuOpen(false)
    setTourIndex(null)
    setTourPaused(false)
    setManualControl(false)
    setWelcomeOpen(false)
  }, [])
  const resetView = useCallback(() => {
    setSelected(null)
    setTourIndex(null)
    setTourPaused(false)
    setManualControl(false)
  }, [])
  const handleManualControl = useCallback(() => {
    setTourIndex(null)
    setTourPaused(false)
    setManualControl(true)
  }, [])
  const startTour = useCallback(() => {
    setSelected(null)
    setMenuOpen(false)
    setManualControl(false)
    setTourPaused(false)
    setTourIndex(-1)
    setWelcomeOpen(false)
  }, [])
  const toggleAmbient = useCallback(async () => {
    let synth = ambientRef.current
    if (!synth) {
      const context = new AudioContext()
      const master = context.createGain()
      const filter = context.createBiquadFilter()
      filter.type = "lowpass"
      filter.frequency.setValueAtTime(560, context.currentTime)
      master.gain.setValueAtTime(0, context.currentTime)
      filter.connect(master)
      master.connect(context.destination)
      const oscillators = [55, 82.41, 110].map((frequency, index) => {
        const oscillator = context.createOscillator()
        const voice = context.createGain()
        oscillator.type = index === 1 ? "triangle" : "sine"
        oscillator.frequency.setValueAtTime(frequency, context.currentTime)
        voice.gain.setValueAtTime(0.07, context.currentTime)
        oscillator.connect(voice)
        voice.connect(filter)
        oscillator.start()
        return oscillator
      })
      synth = { context, master, oscillators }
      ambientRef.current = synth
    }
    await synth.context.resume()
    if (ambientOn) {
      synth.master.gain.setTargetAtTime(0, synth.context.currentTime, 0.35)
      setAmbientOn(false)
    } else {
      synth.master.gain.setTargetAtTime(0.12, synth.context.currentTime, 0.8)
      setAmbientOn(true)
    }
  }, [ambientOn])
  useEffect(() => {
    if (tourIndex === null || tourPaused) return
    const timer = window.setTimeout(() => {
      if (tourIndex >= ventures.length - 1) {
        setTourIndex(null)
        setTourPaused(false)
      } else {
        setTourIndex(tourIndex + 1)
      }
    }, tourIndex === -1 ? 3400 : 5000)
    return () => window.clearTimeout(timer)
  }, [tourIndex, tourPaused, ventures.length])
  useEffect(() => () => {
    const synth = ambientRef.current
    if (synth) {
      synth.oscillators.forEach((oscillator) => oscillator.stop())
      void synth.context.close()
    }
  }, [])
  const tourTarget = tourIndex !== null && tourIndex >= 0 ? ventures[tourIndex] ?? null : null
  const tourTitle = tourIndex === -1 ? "The Sun Hub" : tourTarget?.title ?? ""
  const tourDescription = tourIndex === -1 ? "Every division begins at the heart of this universe. From here, follow each orbit into a different kind of dream." : tourTarget ? divisionExperience[tourTarget.id]?.lore ?? tourTarget.story : ""
  return <main className={`galaxy-shell${sceneFailed ? " galaxy-shell-fallback" : ""}${sceneFailed && selected ? " galaxy-shell-fallback-selected" : ""}${sceneFailed && tourIndex !== null ? " galaxy-shell-fallback-touring" : ""}${tourIndex !== null ? " galaxy-shell-touring" : ""}`}>
    <div className="universe-ui" inert={welcomeOpen} aria-hidden={welcomeOpen}>
      <div className="nebula nebula-one" /><div className="nebula nebula-two" /><div className="grain" />
      <div className="scene-wrap"><SceneErrorBoundary onError={() => setSceneFailed(true)} fallback={<GalaxyFallback ventures={ventures} onSelect={selectVenture} onStandardMode={() => onModeChange("standard")} />}><Suspense fallback={null}><GalaxyScene ventures={ventures} selected={selected} tourTarget={tourTarget} manualControl={manualControl} onManualControl={handleManualControl} onSelect={selectVenture} onReset={resetView} orbitPaused={orbitPaused} /></Suspense></SceneErrorBoundary></div>
      <header className="hud-header">
        <Link className="brand-mark" href="/" onClick={(event) => { event.preventDefault(); resetView() }} aria-label="Never Forget to Dream home"><span className="brand-symbol"><Sparkles size={18} strokeWidth={1.5} /></span><span className="brand-name">NEVER FORGET<span>TO DREAM INC.</span></span></Link>
        <div className="header-actions"><div className="nav-wrap"><button className="nav-pill" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-haspopup="true"><Compass size={15} /> <span>EXPLORE WORLDS</span><ChevronDown size={14} className={menuOpen ? "chevron-up" : ""} /></button>
        {menuOpen && <div className="quick-menu">{ventures.map((venture) => <button key={venture.id} onClick={() => selectVenture(venture)}><span className="menu-dot" style={{ background: venture.color }} />{venture.shortTitle}<ArrowUpRight size={13} /></button>)}</div>}</div>
        <button className={`sound-toggle${ambientOn ? " sound-toggle-on" : ""}`} onClick={toggleAmbient} aria-label={ambientOn ? "Mute ambient sound" : "Play ambient sound"} aria-pressed={ambientOn} title={ambientOn ? "Mute ambient sound" : "Play ambient sound"}>{ambientOn ? <Volume2 size={15} /> : <VolumeX size={15} />}</button>
        <div className="mode-switch" aria-label="Site view"><ModeSelector currentMode="galaxy" onModeChange={onModeChange} variant="galaxy" /></div></div>
      </header>
      <div className="hero-copy" aria-hidden={selected ? "true" : undefined}><p className="eyebrow"><span /> A UNIVERSE OF IDEAS</p><h1>Every dream<br />has <em>a world.</em></h1><p className="hero-subtitle">A constellation of things we&apos;re building, making, and dreaming into being.</p><div className="hero-hint"><Move3D size={14} strokeWidth={1.6} /><span>DRAG TO EXPLORE</span><i /> <span>SELECT A WORLD</span></div></div>
      <div className="scene-caption"><span className="caption-line" /> THE NEVER FORGET UNIVERSE <span className="caption-index">01 — 08</span></div>
      <nav className="accessible-jump" aria-label="Quick jump to a world"><button className="orbit-toggle" onClick={() => setOrbitPaused((paused) => !paused)} aria-pressed={orbitPaused}>{orbitPaused ? "RESUME ORBIT" : "PAUSE ORBIT"}</button><span>QUICK JUMP</span>{ventures.map((venture, index) => <button key={venture.id} className={`jump-world${selected?.id === venture.id ? " jump-active" : ""}`} style={{ "--planet-color": venture.color } as CSSProperties} onClick={() => selectVenture(venture)} aria-label={`Explore ${venture.title}`} aria-pressed={selected?.id === venture.id} title={venture.title}><i />{String(index + 1).padStart(2, "0")} · {venture.shortTitle}</button>)}</nav>
      <div className="footer-note"><span className="live-dot" /> EIGHT WORLDS, ONE DREAM <span className="footer-divider">/</span><Link href="/back-office">FOUNDER PORTAL</Link></div>
      {selected && <VentureDrawer key={selected.id} venture={selected} index={ventures.findIndex((venture) => venture.id === selected.id)} onClose={resetView} onModeChange={onModeChange} />}
    </div>
    {tourIndex !== null && <TourGuide stop={tourIndex + 2} total={ventures.length + 1} title={tourTitle} description={tourDescription} paused={tourPaused} onTogglePause={() => setTourPaused((paused) => !paused)} onTakeControl={handleManualControl} />}
    {welcomeOpen && <WelcomeOverlay onEnter={() => setWelcomeOpen(false)} onTour={startTour} />}
  </main>
}
