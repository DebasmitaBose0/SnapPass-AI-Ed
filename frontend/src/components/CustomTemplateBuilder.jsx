import React from 'react';
import useCustomTemplate from '../hooks/useCustomTemplate';
import './CustomTemplateBuilder.css';

export default function CustomTemplateBuilder() {
  const { template, updateDimensions } = useCustomTemplate();

  return (
    <div className="custom-template-builder">
      <h3>Create Custom Print Layout Template</h3>
      <input
        type="number"
        value={template.cols}
        onChange={(e) =>
          updateDimensions(template.rows, parseInt(e.target.value))
        }
      />
    </div>
  );
}
