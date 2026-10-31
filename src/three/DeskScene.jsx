import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'
import { woodTexture, coverTexture, plainManila, dossierTexture, polaroidTexture, stickyTexture } from './textures'

const FOLDER_W = 3.2
const FOLDER_D = 2.3

function Desk() {
  const map = useMemo(() => woodTexture(), [])
  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow position={[0, -0.01, 0]}>
      <planeGeometry args={[24, 16]} />
      <meshStandardMaterial map={map} roughness={0.82} metalness={0.05} />
    </mesh>
  )
}

function Folder({ progress }) {
  const cover = useRef()
  const paper = useRef()
  const tex = useMemo(() => ({ cover: coverTexture(), plain: plainManila(), dossier: dossierTexture() }), [])
  const edge = useMemo(() => new THREE.MeshStandardMaterial({ color: '#b8965c', roughness: 0.9 }), [])
  const coverMats = useMemo(
    () => [
      edge, edge,
      new THREE.MeshStandardMaterial({ map: tex.cover, roughness: 0.85 }),
      new THREE.MeshStandardMaterial({ map: tex.plain, roughness: 0.9 }),
      edge, edge,
    ],
    [tex, edge]
  )
  useFrame(() => {
    const p = progress.current
    // cover swings open over the first ~55% of the hero scroll
    const open = THREE.MathUtils.smoothstep(p, 0.05, 0.55)
    if (cover.current) cover.current.rotation.z = open * Math.PI * 0.97
    // the dossier page slides out a little once the folder is open
    if (paper.current) paper.current.position.z = THREE.MathUtils.lerp(0.04, -0.18, THREE.MathUtils.smoothstep(p, 0.45, 0.9))
  })
  return (
    <group position={[0.25, 0, 0.1]} rotation-y={-0.06}>
      {/* back board + tab */}
      <mesh castShadow receiveShadow position={[0, 0.01, 0]}>
        <boxGeometry args={[FOLDER_W, 0.02, FOLDER_D]} />
        <meshStandardMaterial map={tex.plain} roughness={0.9} />
      </mesh>
      <mesh castShadow position={[-0.7, 0.01, -FOLDER_D / 2 - 0.12]}>
        <boxGeometry args={[1.2, 0.02, 0.26]} />
        <meshStandardMaterial map={tex.plain} roughness={0.9} />
      </mesh>
      {/* dossier sheet inside */}
      <mesh ref={paper} rotation-x={-Math.PI / 2} position={[0.05, 0.024, 0.04]} castShadow receiveShadow>
        <planeGeometry args={[2.0, 2.58]} />
        <meshStandardMaterial map={tex.dossier} roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      {/* hinged cover: pivot on the left spine */}
      <group ref={cover} position={[-FOLDER_W / 2, 0.045, 0]}>
        <mesh castShadow receiveShadow position={[FOLDER_W / 2, 0, 0]} material={coverMats}>
          <boxGeometry args={[FOLDER_W, 0.02, FOLDER_D]} />
        </mesh>
      </group>
    </group>
  )
}

function Card({ texture, size, position, rotation = 0, pin = true }) {
  return (
    <group position={position} rotation-y={rotation}>
      <mesh rotation-x={-Math.PI / 2} castShadow receiveShadow>
        <planeGeometry args={size} />
        <meshStandardMaterial map={texture} roughness={0.9} />
      </mesh>
      {pin && (
        <mesh position={[0, 0.05, -size[1] / 2 + 0.12]} castShadow>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#e5372e" roughness={0.35} metalness={0.1} />
        </mesh>
      )}
    </group>
  )
}

function Thread({ points }) {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)))
    return new THREE.TubeGeometry(curve, 80, 0.012, 6, false)
  }, [points])
  return (
    <mesh geometry={geo} castShadow>
      <meshStandardMaterial color="#e5372e" roughness={0.6} emissive="#5a0d0a" emissiveIntensity={0.4} />
    </mesh>
  )
}

function Dust() {
  const ref = useRef()
  const count = 420
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 7
      a[i * 3 + 1] = Math.random() * 3.5
      a[i * 3 + 2] = (Math.random() - 0.5) * 5
    }
    return a
  }, [])
  useFrame((_, dt) => {
    const arr = ref.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += dt * 0.05
      arr[i * 3] += Math.sin(arr[i * 3 + 1] * 2 + i) * dt * 0.02
      if (arr[i * 3 + 1] > 3.5) arr[i * 3 + 1] = 0
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#f3dfb5" transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

function Lamp() {
  const light = useRef()
  const { scene } = useThree()
  useEffect(() => {
    const target = new THREE.Object3D()
    target.position.set(0.2, 0, 0.1)
    scene.add(target)
    light.current.target = target
    return () => scene.remove(target)
  }, [scene])
  useFrame(({ clock }) => {
    // tiny flicker
    const t = clock.elapsedTime
    light.current.intensity = 95 + Math.sin(t * 13) * 1.5 + (Math.random() > 0.995 ? -30 : 0)
  })
  return (
    <>
      <spotLight
        ref={light}
        position={[-1.6, 4.6, 1.2]}
        angle={0.62}
        penumbra={0.75}
        decay={1.2}
        distance={14}
        color="#ffd9a0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
      />
      {/* visible light cone */}
      <mesh position={[-0.75, 2.4, 0.65]} rotation={[0.12, 0, -0.38]}>
        <coneGeometry args={[1.9, 4.6, 48, 1, true]} />
        <meshBasicMaterial color="#ffd9a0" transparent opacity={0.035} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      <ambientLight intensity={0.12} color="#9aa3ad" />
      <pointLight position={[4, 1.5, -3]} intensity={6} color="#3cc8be" distance={10} />
    </>
  )
}

function CameraRig({ progress }) {
  const { camera, pointer } = useThree()
  const look = useMemo(() => new THREE.Vector3(), [])
  useFrame(() => {
    const p = THREE.MathUtils.smoothstep(progress.current, 0, 1)
    const tx = THREE.MathUtils.lerp(-1.0, 0.45, p) + pointer.x * 0.35
    const ty = THREE.MathUtils.lerp(5.0, 2.7, p) + pointer.y * 0.18
    const tz = THREE.MathUtils.lerp(4.0, 1.5, p)
    camera.position.x += (tx - camera.position.x) * 0.06
    camera.position.y += (ty - camera.position.y) * 0.06
    camera.position.z += (tz - camera.position.z) * 0.06
    // starts looking left of the folder (so it sits on the right, clear of the title), then centres on it
    look.set(THREE.MathUtils.lerp(-1.3, 0.45, p), 0, THREE.MathUtils.lerp(0.35, -0.1, p))
    camera.lookAt(look)
  })
  return null
}

function Effects() {
  const ca = useRef()
  const spike = useRef(0)
  useEffect(() => {
    const on = () => (spike.current = 1)
    window.addEventListener('casefile:glitch', on)
    return () => window.removeEventListener('casefile:glitch', on)
  }, [])
  const offset = useMemo(() => new THREE.Vector2(0.0008, 0.0006), [])
  useFrame((_, dt) => {
    spike.current = Math.max(0, spike.current - dt * 3)
    const s = 0.0008 + spike.current * 0.012
    offset.set(s, s * 0.7)
    if (ca.current?.offset) ca.current.offset.set(s, s * 0.7)
  })
  return (
    <EffectComposer multisampling={0}>
      <ChromaticAberration ref={ca} offset={offset} radialModulation={false} modulationOffset={0} />
      <Noise opacity={0.09} />
      <Vignette eskil={false} offset={0.25} darkness={0.85} />
    </EffectComposer>
  )
}

function Scene({ progress }) {
  const tex = useMemo(
    () => ({
      a: polaroidTexture('Exhibit A — Noida', 3),
      b: polaroidTexture('Exhibit B — SIH', 7),
      note: stickyTexture('Same suspect in all 3 cases?'),
    }),
    []
  )
  return (
    <>
      <color attach="background" args={['#0c0d0e']} />
      <fog attach="fog" args={['#0c0d0e', 6, 13]} />
      <Lamp />
      <Desk />
      <Folder progress={progress} />
      <Card texture={tex.a} size={[0.95, 1.15]} position={[-2.45, 0.012, -0.55]} rotation={0.22} />
      <Card texture={tex.b} size={[0.95, 1.15]} position={[2.7, 0.012, 0.75]} rotation={-0.18} />
      <Card texture={tex.note} size={[0.8, 0.8]} position={[2.55, 0.014, -0.95]} rotation={0.1} pin={false} />
      <Thread points={[[-2.45, 0.06, -1.05], [-1.6, 0.14, -0.9], [-0.6, 0.08, -0.95]]} />
      <Thread points={[[2.7, 0.06, 0.25], [2.1, 0.16, 0.0], [1.5, 0.08, -0.5]]} />
      <Dust />
      <CameraRig progress={progress} />
      <Effects />
    </>
  )
}

export default function DeskScene({ progress }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0.2, 5, 4], fov: 38, near: 0.1, far: 40 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
      }}
    >
      <Scene progress={progress} />
    </Canvas>
  )
}
