import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';

/* ───────────────────────────────────────
   Utils
   ─────────────────────────────────────── */

/** Returns distance from normalized pointer (-1..1) to a world position. */
function pointerDistance(
  pointer: THREE.Vector2,
  objPos: THREE.Vector3,
  camera: THREE.Camera,
): number {
  const vec = objPos.clone().project(camera);
  return Math.sqrt(
    (pointer.x - vec.x) ** 2 + (pointer.y - vec.y) ** 2,
  );
}

/* ───────────────────────────────────────
   Floating AI Core
   ─────────────────────────────────────── */

function AICore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      meshRef.current.rotation.y += 0.005;
    }
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
    if (glowRef.current) {
      const dist = pointerDistance(state.pointer, new THREE.Vector3(0, 0, 0), state.camera);
      const intensity = Math.max(0.3, 0.8 - dist * 0.5);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = intensity;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Glow halo — pulsing with pointer proximity */}
      <mesh ref={glowRef}>
        <icosahedronGeometry args={[1.6, 0]} />
        <meshBasicMaterial
          color="#00F5FF"
          transparent
          opacity={0.1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.8, 1]} />
        <MeshDistortMaterial
          color="#00F5FF"
          emissive="#00F5FF"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
          distort={0.15}
          speed={1.5}
          wireframe={false}
        />
      </mesh>

      {/* Wireframe shell */}
      <mesh>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshBasicMaterial
          color="#7B61FF"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Outer glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 1.8, 64]} />
        <MeshDistortMaterial
          color="#00F5FF"
          emissive="#00F5FF"
          emissiveIntensity={0.3}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
          distort={0.05}
          speed={1}
        />
      </mesh>
    </group>
  );
}

/* ───────────────────────────────────────
   Floating GPU Model
   ─────────────────────────────────────── */

function GPUModel() {
  const groupRef = useRef<THREE.Group>(null);
  const edgeRef = useRef<THREE.LineSegments>(null);
  const hoverGlow = useRef(0);

  // GPU body geometry (stylized box)
  const geo = useMemo(() => new THREE.BoxGeometry(1.2, 0.2, 0.8), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);
  const chipPositions = useMemo(() => {
    const pos: [number, number, number][] = [];
    for (let i = 0; i < 6; i++) {
      pos.push([
        (Math.random() - 0.5) * 0.9,
        0.15,
        (Math.random() - 0.5) * 0.6,
      ]);
    }
    return pos;
  }, []);

  // Cleanup geometries
  useEffect(() => () => { geo.dispose(); edges.dispose(); }, [geo, edges]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.6 - 2.5;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.3 + 0.2;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
      groupRef.current.rotation.y += 0.008;

      // Hover proximity glow
      const objPos = new THREE.Vector3();
      groupRef.current.getWorldPosition(objPos);
      const dist = pointerDistance(state.pointer, objPos, state.camera);
      hoverGlow.current += (Math.max(0, 0.7 - dist * 0.4) - hoverGlow.current) * 0.05;

      if (edgeRef.current) {
        (edgeRef.current.material as THREE.LineBasicMaterial).opacity =
          0.3 + hoverGlow.current * 0.5;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* GPU body */}
      <mesh geometry={geo}>
        <meshStandardMaterial
          color="#18181B"
          metalness={0.8}
          roughness={0.3}
          emissive="#7B61FF"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Glowing edges */}
      <lineSegments ref={edgeRef} geometry={edges}>
        <lineBasicMaterial
          color="#7B61FF"
          transparent
          opacity={0.3}
        />
      </lineSegments>

      {/* VRAM chips */}
      {chipPositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.12, 0.04, 0.12]} />
          <meshStandardMaterial
            color="#00F5FF"
            emissive="#00F5FF"
            emissiveIntensity={0.4}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}

      {/* Center core glow */}
      <mesh position={[0, 0.12, 0]}>
        <planeGeometry args={[0.3, 0.3]} />
        <meshBasicMaterial
          color="#00F5FF"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ───────────────────────────────────────
   Second GPU model (different position/color)
   ─────────────────────────────────────── */

function GPUModel2() {
  const groupRef = useRef<THREE.Group>(null);
  const edgeRef = useRef<THREE.LineSegments>(null);
  const geo = useMemo(() => new THREE.BoxGeometry(1.0, 0.18, 0.7), []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.25 + 1) * 0.5 + 2.8;
      groupRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.18) * 0.25 - 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.15;
      groupRef.current.rotation.y += 0.006;

      if (edgeRef.current) {
        const objPos = new THREE.Vector3();
        groupRef.current.getWorldPosition(objPos);
        const dist = pointerDistance(state.pointer, objPos, state.camera);
        const glow = Math.max(0, 0.6 - dist * 0.35);
        (edgeRef.current.material as THREE.LineBasicMaterial).opacity = 0.2 + glow * 0.5;
      }
    }
  });

  const edges = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);

  // Cleanup geometries
  useEffect(() => () => { geo.dispose(); edges.dispose(); }, [geo, edges]);

  return (
    <group ref={groupRef}>
      <mesh geometry={geo}>
        <meshStandardMaterial
          color="#18181B"
          metalness={0.7}
          roughness={0.4}
          emissive="#A855F7"
          emissiveIntensity={0.1}
        />
      </mesh>
      <lineSegments ref={edgeRef} geometry={edges}>
        <lineBasicMaterial color="#A855F7" transparent opacity={0.25} />
      </lineSegments>
      {/* VRAM chips */}
      {[[0.3, 0.12, 0.2], [-0.3, 0.12, -0.2], [0, 0.12, 0.3]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.1, 0.03, 0.1]} />
          <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={0.3} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

/* ───────────────────────────────────────
   Floating Torus Ring
   ─────────────────────────────────────── */

function EnergyRing({ position = [2.2, 0.5, -1] as [number, number, number], color = '#7B61FF', index = 0 }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15 + index) * 0.2;
      ref.current.rotation.z += 0.008 + index * 0.002;
    }
  });

  return (
    <Float speed={1.5 + index * 0.2} rotationIntensity={0.3} floatIntensity={1.5}>
      <mesh ref={ref} position={position}>
        <torusGeometry args={[0.5 + index * 0.08, 0.06, 16, 48]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.4}
          distort={0.08}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

/* ───────────────────────────────────────
   Floating Orbs (hover-aware)
   ─────────────────────────────────────── */

function HoverOrb({
  position,
  color = '#00F5FF',
  size = 0.15,
  index = 0,
}: {
  position: [number, number, number];
  color?: string;
  size?: number;
  index?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const targetScale = useRef(1);
  const currentScale = useRef(1);

  useFrame((state) => {
    if (ref.current) {
      // Floating motion
      ref.current.position.y +=
        Math.sin(state.clock.elapsedTime * 0.5 + position[0] + index) * 0.002;

      // Pointer proximity → scale up + glow
      const objPos = new THREE.Vector3();
      ref.current.getWorldPosition(objPos);
      const dist = pointerDistance(state.pointer, objPos, state.camera);
      targetScale.current = 1 + Math.max(0, 1.2 - dist * 0.8) * 1.5;
      currentScale.current += (targetScale.current - currentScale.current) * 0.05;
      ref.current.scale.setScalar(currentScale.current);

      // Glow opacity
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.min(1, 0.5 + (currentScale.current - 1) * 0.3);
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </mesh>
  );
}

/* ───────────────────────────────────────
   Particle system (background stars)
   ─────────────────────────────────────── */

function Particles({ count = 300 }) {
  const meshRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.015;
    }
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        size={0.04}
        color="#00F5FF"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ───────────────────────────────────────
   Neural Network — nodes + connections
   ─────────────────────────────────────── */

interface NNNode {
  pos: [number, number, number];
  layer: number;
}

function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null);

  // Generate nodes in a 3-layer network
  const { nodes, connections } = useMemo(() => {
    const n: NNNode[] = [];
    const layers = [5, 8, 5];
    const layerSpacing = 1.6;
    const startX = -1.6;

    layers.forEach((count, li) => {
      const x = startX + li * layerSpacing;
      for (let i = 0; i < count; i++) {
        const y = (i - (count - 1) / 2) * 0.5;
        const z = (Math.random() - 0.5) * 0.4;
        n.push({ pos: [x, y, z], layer: li });
      }
    });

    // Connect adjacent layers
    const conns: Array<{ from: number; to: number }> = [];

    // Connect nodes between layer 0→1 and 1→2
    let nodeIdx = 0;
    for (let li = 0; li < layers.length - 1; li++) {
      const start = nodeIdx;
      nodeIdx += layers[li]!;
      const end = nodeIdx;
      for (let a = start; a < end; a++) {
        const neighbors = Math.min(layers[li + 1]!, 4);
        const used = new Set<number>();
        for (let k = 0; k < neighbors; k++) {
          let b: number;
          do {
            b = end + Math.floor(Math.random() * layers[li + 1]!);
          } while (used.has(b));
          used.add(b);
          conns.push({ from: a, to: b });
        }
      }
    }

    return { nodes: n, connections: conns };
  }, []);

  // Node sphere refs for animation
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);
  nodeRefs.current.length = nodes.length;

  useFrame((state) => {
    nodes.forEach((node, i) => {
      const mesh = nodeRefs.current[i];
      if (!mesh) return;
      const bounce = Math.sin(state.clock.elapsedTime * 0.5 + node.pos[0] + node.pos[1]) * 0.03;
      mesh.position.y = node.pos[1] + bounce;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.15;
    });
  });

  const lineColors = ['#00F5FF', '#7B61FF', '#A855F7'];

  return (
    <group ref={groupRef} position={[0.8, -0.5, -1.5]}>
      {/* Connection lines */}
      {connections.map((conn, i) => {
        const from = nodes[conn.from]!;
        const to = nodes[conn.to]!;
        const mid: [number, number, number] = [
          (from.pos[0] + to.pos[0]) / 2,
          (from.pos[1] + to.pos[1]) / 2,
          (from.pos[2] + to.pos[2]) / 2,
        ];
        const pts: [number, number, number][] = [from.pos, mid, to.pos];
        return (
          <Line
            key={i}
            points={pts}
            color={lineColors[i % 3]!}
            lineWidth={0.5}
            transparent
            opacity={0.08}
          />
        );
      })}

      {/* Node spheres */}
      {nodes.map((node, i) => (
        <mesh
          key={i}
          ref={(el: THREE.Mesh | null) => { nodeRefs.current[i] = el; }}
          position={node.pos}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial
            color={lineColors[node.layer % 3]!}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ───────────────────────────────────────
   Data stream lines
   ─────────────────────────────────────── */

function DataStreams() {
  const lines = useMemo(() => {
    const result: Array<{ points: [number, number, number][]; color: string }> = [];
    const colors = ['#00F5FF', '#7B61FF', '#A855F7'];
    for (let i = 0; i < 10; i++) {
      const pts: [number, number, number][] = [];
      const x = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 5 - 1;
      for (let j = 0; j <= 20; j++) {
        pts.push([
          x + Math.sin(j * 0.3 + i) * 0.4,
          -3 + j * 0.3,
          z + Math.cos(j * 0.2 + i) * 0.3,
        ]);
      }
      const curve = new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
      result.push({
        points: curve.getPoints(24).map((v): [number, number, number] => [v.x, v.y, v.z]),
        color: colors[i % colors.length]!,
      });
    }
    return result;
  }, []);

  return (
    <group>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={line.points}
          color={line.color}
          lineWidth={1}
          transparent
          opacity={0.06 + (i % 5) * 0.015}
        />
      ))}
    </group>
  );
}

/* ───────────────────────────────────────
   Camera controller (mouse parallax)
   ─────────────────────────────────────── */

function CameraController() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    target.current.x += (state.pointer.x * 0.3 - target.current.x) * 0.02;
    target.current.y += (-state.pointer.y * 0.2 - target.current.y) * 0.02;
    camera.position.x += (target.current.x - camera.position.x) * 0.02;
    camera.position.y += (target.current.y + 1.5 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ───────────────────────────────────────
   Holographic energy rings around AI Core
   ─────────────────────────────────────── */

function HolographicRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {[0, 1, 2].map((ringI) => (
        <mesh key={ringI} rotation={[Math.PI / 2 + ringI * 0.4, ringI * 0.3, 0]}>
          <ringGeometry args={[1.8 + ringI * 0.3, 1.9 + ringI * 0.3, 64]} />
          <meshBasicMaterial
            color={ringI === 0 ? '#00F5FF' : ringI === 1 ? '#7B61FF' : '#A855F7'}
            transparent
            opacity={0.08 - ringI * 0.02}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ───────────────────────────────────────
   Data cubes — floating techy blocks
   ─────────────────────────────────────── */

function DataCubes() {
  const cubes = useMemo(() => {
    return Array.from({ length: 15 }, () => ({
      pos: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6 - 2,
      ] as [number, number, number],
      size: 0.04 + Math.random() * 0.06,
      speed: 0.2 + Math.random() * 0.3,
      color: ['#00F5FF', '#7B61FF', '#A855F7'][Math.floor(Math.random() * 3)]!,
    }));
  }, []);

  const refs = useRef<(THREE.Mesh | null)[]>([]);
  refs.current.length = cubes.length;

  useFrame((state) => {
    cubes.forEach((cube, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      mesh.rotation.x += 0.01 * cube.speed;
      mesh.rotation.y += 0.015 * cube.speed;
      mesh.position.y += Math.sin(state.clock.elapsedTime * cube.speed + i) * 0.001;
    });
  });

  return (
    <group>
      {cubes.map((cube, i) => (
        <mesh
          key={i}
          ref={(el: THREE.Mesh | null) => { refs.current[i] = el; }}
          position={cube.pos}
        >
          <boxGeometry args={[cube.size, cube.size, cube.size]} />
          <meshBasicMaterial
            color={cube.color}
            transparent
            opacity={0.3 + Math.random() * 0.2}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
}

/* ───────────────────────────────────────
   Main Scene
   ─────────────────────────────────────── */

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 50, near: 0.1, far: 20 }}
        frameloop="always"
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[0.5, 1]}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#00F5FF" />
        <pointLight position={[-3, -2, 4]} intensity={0.4} color="#7B61FF" />

        <CameraController />
        <AICore />
        <HolographicRings />
        <GPUModel />
        <GPUModel2 />
        <EnergyRing position={[2.2, 0.5, -1]} color="#7B61FF" index={0} />
        <EnergyRing position={[-1.8, -0.3, -1.5]} color="#A855F7" index={1} />
        <EnergyRing position={[0, 1.5, -2.5]} color="#00F5FF" index={2} />
        <HoverOrb position={[-1.5, 1.2, -1]} color="#00F5FF" index={0} />
        <HoverOrb position={[1.8, -0.8, -0.5]} color="#7B61FF" size={0.12} index={1} />
        <HoverOrb position={[-2, -1, 0.5]} color="#A855F7" size={0.1} index={2} />
        <HoverOrb position={[0.5, -1.5, -1.5]} color="#00F5FF" size={0.08} index={3} />
        <HoverOrb position={[3, 0, 0.5]} color="#7B61FF" size={0.1} index={4} />
        <Particles count={250} />
        <NeuralNetwork />
        <DataStreams />
        <DataCubes />
      </Canvas>
    </div>
  );
}
