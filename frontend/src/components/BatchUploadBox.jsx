import React, { useRef, useState } from 'react';
import { validateImageFile } from '../utils/fileValidation';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { useToast } from '../context/ToastContext';
import './UploadBox.css';

function BatchUploadBox({ onFilesSelected, maxFiles = 10 }) {
  const { language } = useLanguage();
  const t = translations[language];
  const inputRef = useRef(null);
  const { showToast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [rejectedFiles, setRejectedFiles] = useState([]);

  const validateFiles = (fileList) => {
    const valid = [];
    const rejected = [];
    const files = Array.from(fileList);

    for (const file of files) {
      const result = validateImageFile(file);
      if (result.valid) {
        valid.push(file);
      } else {
        rejected.push({ name: file.name, reason: result.error });
      }
    }

    if (valid.length + (onFilesSelected ? 0 : 0) > maxFiles) {
      showToast(`Maximum ${maxFiles} files allowed.`, 'warning');
      valid.splice(maxFiles);
    }

    return { valid, rejected };
  };

  const handleFiles = (fileList) => {
    setRejectedFiles([]);
    const { valid, rejected } = validateFiles(fileList);

    if (rejected.length > 0) {
      setRejectedFiles(rejected);
      showToast(`${rejected.length} file(s) rejected due to validation.`, 'error');
    }

    if (valid.length > 0 && onFilesSelected) {
      onFilesSelected(valid);
    }
  };

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = '';
  };

  return (
    <div
      className={`upload-box upload-box--batch${isDragging ? ' upload-box--dragging' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => inputRef.current.click()}
      role="button"
      tabIndex={0}
      aria-label="Click or drag photos to upload in batch"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        className="upload-box__input"
        onChange={onChange}
        multiple
        aria-hidden="true"
      />

      <div className="upload-box__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M12 16V5" />
          <path d="M8 9l4-4 4 4" />
          <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
          <path d="M17 9l3 3 3-3" />
          <path d="M20 12V5" />
        </svg>
      </div>

      <p className="upload-box__title">{t.dragDropPhoto || 'Drag & drop your photos here'}</p>
      <p className="upload-box__subtitle">
        {t.browseFiles || 'browse files'} &middot; {t.uploadFormats || 'JPG, PNG, WEBP'} &middot; Max {maxFiles} files
      </p>

      {rejectedFiles.length > 0 && (
        <div className="upload-box__rejected">
          <p className="upload-box__rejected-title">Rejected files:</p>
          <ul>
            {rejectedFiles.map((rf) => (
              <li key={rf.name}>
                {rf.name} &mdash; {rf.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default BatchUploadBox;
