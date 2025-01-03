

import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import axios from 'axios';
import * as THREE from 'three';

function Model({ modelUrl, color, size, texture }) {
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

function Experience() {
  const [modelData, setModelData] = useState(null);
  const [color, setColor] = useState("#FFFFFF");
  const [size, setSize] = useState({ width: 1, height: 1, depth: 1 });
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    axios
      .get(`https://a-3d-product-visualization-platform.onrender.com/api/v1/product/products`)
      .then((response) => setModelData(response.data[0]))
      .catch((error) => console.error('Error fetching model data:', error));
  }, []);

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  const handleSizeChange = (e) => {
    const { name, value } = e.target;
    setSize((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  const handleTextureChange = (e) => {
    const textureUrl = e.target.value;
    const loader = new THREE.TextureLoader();
    loader.load(textureUrl, (loadedTexture) => {
      setTexture(loadedTexture);
    });
  };

  const handleSave = () => {
    if (!modelData) return;

    const customizationData = {
      modelId: modelData._id,
      color,
      size,
      textureUrl: texture?.image?.currentSrc || null,
    };

    axios
      .post('https://a-3d-product-visualization-platform.onrender.com/api/v1/customization/customization', customizationData)
      .then((response) => {
        alert('Customization saved successfully!');
        console.log('Saved:', response.data);
      })
      .catch((error) => {
        alert('Failed to save customization.');
        console.error('Save Error:', error);
      });
  };

  if (!modelData) return <div className="text-center text-gray-500 mt-10">Loading...</div>;

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-100 p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Customization</h2>

        {/* Color Picker */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Color</label>
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="w-full h-10 rounded border border-gray-300 mt-1"
          />
        </div>

        {/* Size Customization */}
        {['Width', 'Height', 'Depth'].map((dim) => (
          <div key={dim} className="mb-4">
            <label className="block text-sm font-medium text-gray-600">{dim}</label>
            <input
              type="number"
              name={dim.toLowerCase()}
              value={size[dim.toLowerCase()]}
              onChange={handleSizeChange}
              min="0.1"
              step="0.1"
              className="w-full rounded border border-gray-300 p-2 mt-1"
            />
          </div>
        ))}

        {/* Texture Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Texture</label>
          <select
            onChange={handleTextureChange}
            className="w-full rounded border border-gray-300 p-2 mt-1"
          >
            {modelData.textures.map((textureUrl, index) => (
              <option
                key={index}
                value={`https://a-3d-product-visualization-platform.onrender.com/models/painted_wooden/${textureUrl}`}
              >
                {textureUrl}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-2 bg-green-500 text-white font-medium rounded shadow hover:bg-green-600 transition duration-150"
        >
          Save Customization
        </button>
      </div>

      <div className="flex-1 bg-gray-50">
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} />
          <Model
            modelUrl={`https://a-3d-product-visualization-platform.onrender.com${modelData.modelPath}`}
            color={color}
            size={size}
            texture={texture}
          />
          <OrbitControls enableZoom={true} enablePan={true} />
        </Canvas>
      </div>
    </div>
  );
}

export default Experience;



