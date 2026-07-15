import React, { useState } from 'react';
import './SkipToContent.css';

function SkipToContent() {
  const [focused, setFocused] = useState(false);

  return (
    <a
      className={`skip-to-content${focused ? ' skip-to-content--visible' : ''}`}
      href="#main-content"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onClick={() => {
        const main = document.getElementById('main-content');
        if (main) main.focus({ preventScroll: false });
      }}
    >
      Skip to main content
    </a>
  );
}

export default SkipToContent;
