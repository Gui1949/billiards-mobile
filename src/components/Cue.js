import React from 'react';
import PropTypes from 'prop-types';

function Cue({ setRef, cueRef, position }) {
  return (
    <mesh
      ref={setRef}
      cueBallRef={cueRef}
      speed={0.6}
      position={position}
      castShadow>

    </mesh>
  );
}

Cue.propTypes = {
  setRef: PropTypes.objectOf(PropTypes.any),
  cueRef: PropTypes.objectOf(PropTypes.any),
  position: PropTypes.arrayOf(PropTypes.any)
};

Cue.defaultProps = {
  setRef: {},
  cueRef: {},
  position: [0, 0, 0]
};

export default Cue;
