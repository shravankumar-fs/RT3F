import { Suspense, useEffect, useRef } from 'react';
import './App.css';
import {
  Canvas,
  extend,
  ReactThreeFiber,
  useFrame,
  useLoader,
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

const Cube = (props: any) => {
  const texture = useLoader(THREE.TextureLoader, `https://picsum.photos/200`);
  const meshref = useRef() as any;
  const value =
    (Math.random() > 0.8 ? 0.8 : Math.random() > 0.4 ? 0.4 : 0.2) * 0.1;
  let val = 0;
  useFrame(() => {
    (meshref?.current as THREE.Mesh).rotation.z += 0.01;
    (meshref?.current as THREE.Mesh).rotation.x +=
      0.01 * (value === 0.4 ? 1 : -1);
    (meshref?.current as THREE.Mesh).position.y =
      (Math.abs(Math.sin(val)) < 0.5
        ? Math.abs(Math.cos(val))
        : Math.abs(Math.sin(val))) + props.position[1];
    val += value;
  });

  return (
    <mesh ref={meshref} {...props} castShadow>
      <boxBufferGeometry />
      <meshPhysicalMaterial
        // color='blue'
        map={texture}
        transparent={true}
        opacity={Math.random() > 0.5 ? 1 : 0.9}
        roughness={0.5}
        // metalness={1}
        clearcoat={1}
        transmission={0.5}
        reflectivity={1}
      />
    </mesh>
  );
};

const Floor = () => {
  const ref = useRef() as any;
  useEffect(() => {
    if (ref.current) (ref.current as THREE.Mesh).rotation.x = Math.PI / 2;
  }, []);

  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry args={[10, 10, 100, 100]} />
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

const Background = () => {
  const sky =
    'https://raw.githubusercontent.com/explearning/threejs-react/main/public/autoshop.jpg';
  const texture = useLoader(THREE.TextureLoader, sky);

  const { gl } = useThree();
  const formatted = new THREE.WebGLCubeRenderTarget(
    texture.image.height
  ).fromEquirectangularTexture(gl, texture);

  return <primitive object={formatted.texture} attach='background' />;
};
function App() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Canvas
        style={{ background: 'black' }}
        camera={{ position: [0, 5, 10] }}
        shadows
      >
        <ambientLight position={[0, 15, 0]} intensity={0.1} color='0xffff00' />
        <Bulb />
        <Orbit />
        <Suspense fallback={null}>
          <Cube position={[1, 1, 0]} />
          <Cube position={[-1, 2, 0]} />
        </Suspense>
        <Suspense>
          <Background />
        </Suspense>
        <Floor />
      </Canvas>
    </div>
  );
}

export default App;
