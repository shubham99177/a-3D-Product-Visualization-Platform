import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import axios from 'axios';

function ModelPreview({ modelUrl, color, size, texture }) {
  const { scene } = useGLTF(modelUrl);

  scene.traverse((child) => {
    if (child.isMesh) {
      if (texture) {
        child.material.map = texture;
        child.material.needsUpdate = true;
      }
      if (color) {
        child.material.color.set(color);
      }
    }
  });

  scene.scale.set(size.width, size.height, size.depth);

  return <primitive object={scene} />;
}

function CustomizationsList() {
  const [customizations, setCustomizations] = useState([]);
  const [selectedCustomization, setSelectedCustomization] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/customization/all-customizations')
      .then(response => {
        setCustomizations(response.data);
      })
      .catch(error => {
        console.error('Error fetching customizations:', error);
      });
  }, []);

  const handlePreview = (customization) => {
    setSelectedCustomization(customization);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 bg-gray-100 p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Saved Customizations</h2>
        <ul className="space-y-4">
          {customizations.map((customization, index) => (
            <li key={index} className="p-4 bg-white shadow rounded-md">
              <p><strong>Model ID:</strong> {customization.modelId}</p>
              <p><strong>Color:</strong> <span style={{ backgroundColor: customization.color }} className="inline-block w-6 h-6 rounded-full"></span></p>
              <p><strong>Texture:</strong> {customization.texture}</p>
              <p><strong>Size:</strong> {customization.size}</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => handlePreview(customization)}
              >
                Preview
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 3D Preview Area */}
      <div className="flex-1 bg-gray-200 p-6">
        {selectedCustomization ? (
          <div className="w-full h-full">
            <h2 className="text-2xl font-semibold mb-4">3D Model Preview</h2>
            <Canvas className="w-full h-[500px]">
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} />
              <ModelPreview
                modelUrl={`http://localhost:8000${selectedCustomization.modelPath}`}
                color={selectedCustomization.color}
                size={JSON.parse(selectedCustomization.size)}
                texture={selectedCustomization.texture ? new THREE.TextureLoader().load(selectedCustomization.texture) : null}
              />
              <OrbitControls />
            </Canvas>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a customization to preview the 3D model.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomizationsList;
