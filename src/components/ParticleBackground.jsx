import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, Effects } from '@react-three/drei';
import { UnrealBloomPass } from 'three-stdlib';
import * as THREE from 'three';

extend({ UnrealBloomPass });

const ParticleSwarm = () => {
  const meshRef = useRef();
  const count = 20000;
  const speedMult = 1;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const pColor = useMemo(() => new THREE.Color(), []);
  const color = pColor; // Alias for user code compatibility
  
  // Track cursor position globally
  const mouse = useMemo(() => ({ x: 0, y: 0, targetX: 0, targetY: 0 }), []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      // Normalize to range [-1, 1]
      mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouse]);

  const positions = useMemo(() => {
     const pos = [];
     for(let i=0; i<count; i++) pos.push(new THREE.Vector3((Math.random()-0.5)*100, (Math.random()-0.5)*100, (Math.random()-0.5)*100));
     return pos;
  }, []);

  // Material & Geom (MeshBasicMaterial & TetrahedronGeometry as requested)
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffffff }), []);
  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.25), []);

  const PARAMS = useMemo(() => ({"radius":58,"flow":0,"vortex":0.48,"layers":11.52,"pulse":0}), []);
  const addControl = (id, l, min, max, val) => {
      return PARAMS[id] !== undefined ? PARAMS[id] : val;
  };
  const setInfo = () => {};
  const annotate = () => {};

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime() * speedMult;
    
    // Smoothly interpolate mouse coordinates for organic motion
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Apply cursor-based offsets to mesh position and rotation
    meshRef.current.position.x = mouse.x * 12;
    meshRef.current.position.y = mouse.y * 12;
    meshRef.current.rotation.x = mouse.y * 0.15;
    meshRef.current.rotation.y = mouse.x * 0.15;

    if(material.uniforms && material.uniforms.uTime) {
         material.uniforms.uTime.value = time;
    }

    // Hoist variables out of the 20,000 loop to avoid 100,000 redundant function calls per frame
    const radius = addControl("radius", "Field Radius", 40, 220, 120);
    const flow = addControl("flow", "Flow Speed", 0, 3, 0.9);
    const vortex = addControl("vortex", "Vortex Strength", 0, 8, 3.5);
    const layers = addControl("layers", "Energy Layers", 2, 16, 8);
    const pulse = addControl("pulse", "Pulse", 0, 4, 1.5);

    for (let i = 0; i < count; i++) {
        // USER CODE START
        const t = i / (count + 0.0001);
        const layer = Math.floor(t * layers);
        const layerT = layer / (layers + 0.0001);
        
        const golden = 2.399963229728653;
        const phi = Math.acos(1 - 2 * t);
        const theta = i * golden + time * flow;
        
        const wave = Math.sin(theta * 2.0 + time * pulse + layerT * 12.0);
        const breathing = 1.0 + 0.18 * Math.sin(time * pulse + layerT * 8.0);
        
        const r = radius * breathing;
        
        const sx = Math.sin(phi) * Math.cos(theta);
        const sy = Math.cos(phi);
        const sz = Math.sin(phi) * Math.sin(theta);
        
        const swirl = vortex * (0.15 + 0.85 * Math.abs(sy));
        
        const x = (sx + Math.cos(theta * 3.0 + time) * swirl * 0.08) * r;
        const y = (sy + wave * 0.12) * r;
        const z = (sz + Math.sin(theta * 3.0 + time) * swirl * 0.08) * r;
        
        target.set(x, y, z);
        
        const energy = 0.5 + 0.5 * wave;
        const hue = (0.55 + energy * 0.25 + layerT * 0.15 + time * 0.02) % 1;
        const saturation = 0.8 + energy * 0.2;
        const lightness = 0.25 + energy * 0.5 + (1.0 - Math.abs(sy)) * 0.15;
        
        color.setHSL(
          hue < 0 ? hue + 1 : hue,
          saturation > 1 ? 1 : saturation,
          lightness > 1 ? 1 : lightness
        );
        
        if (i === 0) {
          setInfo(
            "Quantum Vortex Sphere",
            "A living energy shell formed from golden-angle particle packing, layered wave interference, and rotating vortex currents."
          );
          annotate("core", new THREE.Vector3(0, 0, 0), "Quantum Core");
        }
        // USER CODE END

        positions[i].lerp(target, 0.1);
        dummy.position.copy(positions[i]);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        meshRef.current.setColorAt(i, pColor);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, count]} />
  );
};

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-black pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 100], fov: 60 }}>
        <fog attach="fog" args={['#000000', 0.01]} />
        <ParticleSwarm />
        <OrbitControls autoRotate={true} enableZoom={false} enablePan={false} enableRotate={false} />
        <Effects disableGamma>
            <unrealBloomPass threshold={0} strength={1.8} radius={0.4} />
        </Effects>
      </Canvas>
    </div>
  );
}
