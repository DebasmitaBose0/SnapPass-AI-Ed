import { useState } from 'react';
import { autoEqualize } from '../utils/imageAutoAdjust';

export function useImageProcessor() {
  const [processing, setProcessing] = useState(false);

  const applyAutoFix = async (imageSrc) => {
    setProcessing(true);
    const result = await autoEqualize(imageSrc);
    setProcessing(false);
    return result;
  };

  return { processing, applyAutoFix };
}
