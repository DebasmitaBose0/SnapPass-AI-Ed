import { useState } from 'react';

export default function useAttireOverlay() {
  const [attire, setAttire] = useState('none');
  const [scale, setScale] = useState(1.0);

  const resetAttire = () => {
    setAttire('none');
    setScale(1.0);
  };

  return { attire, setAttire, scale, setScale, resetAttire };
}
