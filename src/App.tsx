import { memo, useEffect, useRef } from 'react';
import './App.css';
import {
  Canvas,
  extend,
  ReactThreeFiber,
  useFrame,
  useThree,
} from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
extend({ OrbitControls });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<
        OrbitControls,
        typeof OrbitControls
      >;
    }
  }
}
const Orbit = () => {
  const { gl, camera } = useThree();
  return <orbitControls args={[camera, gl.domElement]} />;
};
const BoxComponent = memo((props: any) => {
  const meshref = useRef() as any;
  const value =
    (Math.random() > 0.8 ? 0.8 : Math.random() > 0.4 ? 0.4 : 0.2) * 0.1;
  let val = 0;
  useFrame(() => {
    (meshref?.current as THREE.Mesh).rotation.z += 0.01;
    (meshref?.current as THREE.Mesh).position.y =
      Math.sin(val) + props.position[1];
    (meshref?.current as THREE.Mesh).position.x = Math.cos(val);
    val += value;
  });

  return (
    <mesh ref={meshref} {...props} receiveShadow castShadow>
      <boxBufferGeometry />
      <meshPhysicalMaterial
        color='blue'
        transparent={true}
        opacity={Math.random() > 0.5 ? 0.6 : 0.8}
      />
    </mesh>
  );
});

const PlaneComponent = () => {
  const ref = useRef() as any;
  useEffect(() => {
    if (ref.current) (ref.current as THREE.Mesh).rotation.x = Math.PI / 2;
  }, []);

  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry args={[10, 10]} />
      <meshPhysicalMaterial side={THREE.DoubleSide} />
    </mesh>
  );
};

const Bulb = () => {
  return (
    <mesh position={[0, 10, 0]}>
      <pointLight castShadow />
      <sphereBufferGeometry args={[0.2]}></sphereBufferGeometry>
      <meshPhongMaterial emissive='yellow'></meshPhongMaterial>
    </mesh>
  );
};

function App() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Canvas
        style={{ background: 'GREEN' }}
        camera={{ position: [0, 5, 10] }}
        shadows
      >
        <ambientLight position={[0, 15, 0]} intensity={0.1} color='0xffff00' />
        <Bulb />
        <Orbit />
        <BoxComponent position={[2, 3, 1]} />
        <BoxComponent position={[-2, 2, -1]} />
        <PlaneComponent />
      </Canvas>
    </div>
  );
}

export default App;
