import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, MeshTransmissionMaterial } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh, Group } from "three";

/**
 * Floating Glass Prism — central centerpiece with orbiting fragments.
 * Scroll-tied gentle camera dolly + cursor parallax.
 */

const Prism = () => {
  const mesh = useRef<Mesh>(null!);
  useFrame((_, dt) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += dt * 0.15;
    mesh.current.rotation.y += dt * 0.22;
  });
  return (
    <mesh ref={mesh}>
      <boxGeometry args={[2.2, 2.2, 2.2]} />
      <MeshTransmissionMaterial
        thickness={0.6}
        roughness={0.05}
        transmission={1}
        ior={1.4}
        chromaticAberration={0.06}
        anisotropy={0.3}
        distortion={0.3}
        distortionScale={0.4}
        temporalDistortion={0.1}
        color="#a78bfa"
        backside
      />
    </mesh>
  );
};

const Core = () => {
  const ref = useRef<Mesh>(null!);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.scale.setScalar(0.9 + Math.sin(t * 1.4) * 0.08);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.45, 32, 32]} />
      <meshStandardMaterial
        color="#22d3ee"
        emissive="#8b5cf6"
        emissiveIntensity={1.6}
        roughness={0.2}
        metalness={0.7}
      />
    </mesh>
  );
};

const Fragments = () => {
  const group = useRef<Group>(null!);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = clock.getElapsedTime() * 0.05;
  });
  const items = [
    { pos: [-3.4, 1.6, -1] as const, size: 0.5, color: "#22d3ee" },
    { pos: [3.6, -1.2, -0.5] as const, size: 0.7, color: "#a78bfa" },
    { pos: [-2.8, -1.8, 0.5] as const, size: 0.35, color: "#ec4899" },
    { pos: [3.0, 2.0, -1.5] as const, size: 0.55, color: "#8b5cf6" },
    { pos: [0, -2.6, 1] as const, size: 0.4, color: "#22d3ee" },
  ];
  return (
    <group ref={group}>
      {items.map((it, i) => (
        <Float
          key={i}
          speed={1 + (i % 3) * 0.3}
          rotationIntensity={0.6}
          floatIntensity={1.2}
          floatingRange={[-0.3, 0.3]}
        >
          <mesh position={it.pos as unknown as [number, number, number]}>
            {i % 2 === 0 ? (
              <icosahedronGeometry args={[it.size, 0]} />
            ) : (
              <octahedronGeometry args={[it.size, 0]} />
            )}
            <meshStandardMaterial
              color={it.color}
              roughness={0.15}
              metalness={0.85}
              emissive={it.color}
              emissiveIntensity={0.25}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

const Rig = () => {
  useFrame((state) => {
    const { camera, pointer } = state;
    // Cursor parallax
    camera.position.x += (pointer.x * 1.2 - camera.position.x) * 0.03;
    camera.position.y += (-pointer.y * 0.8 - camera.position.y) * 0.03;
    // Scroll dolly
    const scroll =
      typeof window !== "undefined"
        ? window.scrollY /
          Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
        : 0;
    const targetZ = 7 + scroll * 4;
    camera.position.z += (targetZ - camera.position.z) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
};

const Scene3DCanvas = () => {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#a78bfa" />
      <pointLight position={[-5, -3, 2]} intensity={1} color="#22d3ee" />
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
        <Prism />
      </Float>
      <Core />
      <Fragments />
      <Environment preset="night" />
      <Rig />
    </Canvas>
  );
};

export default Scene3DCanvas;
