import React, { useRef, useState } from 'react';
import './UploadBox.css';
import { validateImageFile, validateImageMagicBytes } from '../utils/fileValidation';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { useToast } from '../context/ToastContext';

/**
 * UploadBox — drag-and-drop + click-to-browse photo uploader.
 *
 * Props:
 *   onFileSelect(file) — called when a valid image file is chosen
 *   queue — optional upload queue array from useUploadQueue
 *   addToQueue — function to add files to the queue
 */
function UploadBox({ onFileSelect, queue, addToQueue }) {
  const { language } = useLanguage();
  const t = translations[language];
  const inputRef = useRef(null);
  const { showToast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file) => {
    setError('');

    if (!file) {
      showToast('Please select an image file.', 'error');
      return;
    }

    const result = validateImageFile(file);
    if (!result.valid) {
      showToast(result.error, 'error');
      return;
    }

    const isValidMagic = await validateImageMagicBytes(file);
    if (!isValidMagic) {
      showToast('Invalid file structure.', 'error');
      return;
    }

    if (addToQueue) {
      addToQueue([file]);
      return;
    }

    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 1 && addToQueue) {
      addToQueue(files);
    } else {
      handleFile(files[0]);
    }
  };

  const onChange = (e) => {
    const files = e.target.files;
    if (files.length > 1 && addToQueue) {
      addToQueue(files);
    } else {
      handleFile(files[0]);
    }
    e.target.value = '';
  };

  return (
    <div
      className={`upload-box${isDragging ? ' upload-box--dragging' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => inputRef.current.click()}
      role="button"
      tabIndex={0}
      aria-label="Click or drag a photo to upload"
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        className="upload-box__input"
        onChange={onChange}
        aria-hidden="true"
      />

      <div className="upload-box__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M12 16V5" />
          <path d="M8 9l4-4 4 4" />
          <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
        </svg>
      </div>
      <p className="upload-box__title">{t.dragDropPhoto}</p>
      <p className="upload-box__subtitle">or <span className="upload-box__browse">{t.browseFiles}</span></p>
      <p className="upload-box__hint">{t.uploadFormatsLimit}</p>

      {error && (
        <p className="upload-box__error" role="alert">{error}</p>
      )}

      {queue && queue.length > 0 && (
        <div className="upload-queue">
          <div className="upload-queue__header">
            <span>{queue.length} file{queue.length !== 1 ? 's' : ''}</span>
            <span className="upload-queue__badge">{queue.filter(f => f.status === 'done').length}/{queue.length}</span>
          </div>
          <div className="upload-queue__items">
            {queue.slice(0, 5).map((item) => (
              <div key={item.id} className={`upload-queue__item upload-queue__item--${item.status}`}>
                <span className="upload-queue__name">{item.name}</span>
                <span className="upload-queue__status">
                  {item.status === 'queued' && 'Waiting'}
                  {item.status === 'uploading' && `${item.progress}%`}
                  {item.status === 'done' && 'Done'}
                  {item.status === 'failed' && 'Failed'}
                  {item.status === 'cancelled' && 'Cancelled'}
                </span>
              </div>
            ))}
            {queue.length > 5 && (
              <div className="upload-queue__more">+{queue.length - 5} more</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadBox;
