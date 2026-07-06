import { useState } from 'react';

export default function useCustomTemplate() {
  const [template, setTemplate] = useState({ rows: 4, cols: 6 });

  const updateDimensions = (rows, cols) => {
    setTemplate({ rows, cols });
  };

  return { template, updateDimensions };
}
