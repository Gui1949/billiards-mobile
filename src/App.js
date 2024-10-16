import React, { useState } from 'react';

import { Canvas, CodeFAB } from './GlobalStyles';
import Modal from './components/Modal';
import Scene from './views/Scene';
import Controls from './components/Controls';
import Button from './components/Button';

import Icon from './svg/ic_code.svg';

function App() {
  const [coeff, setCoeff] = useState(0.01);
  return (
    <>
      <Canvas>
        <Scene coeff={coeff} />
        <Controls
          enableRotate={false}
          enablePan={false}
          maxDistance={100}
          minDistance={5}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      <a
        href='https://github.com/Gui1949/billiards-mobile'
        target='_blank'
        rel='noopener noreferrer'>
        <CodeFAB src={Icon} />
      </a>
    </>
  );
}

export default App;
