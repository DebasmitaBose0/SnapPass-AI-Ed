import React, { useState, useEffect, useRef } from 'react';

function AriaAnnouncer({ message, politeness = 'polite', timeout = 3000 }) {
  const [active, setActive] = useState('');
  const timerRef = useRef(null);
  const prevRef = useRef('');

  useEffect(() => {
    if (!message || message === prevRef.current) return;

    prevRef.current = message;
    if (timerRef.current) clearTimeout(timerRef.current);

    setActive('');
    requestAnimationFrame(() => {
      setActive(message);
    });

    timerRef.current = setTimeout(() => setActive(''), timeout);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [message, timeout]);

  return (
    <div
      className="sr-only"
      role="status"
      aria-live={politeness}
      aria-atomic="true"
    >
      {active}
    </div>
  );
}

export default AriaAnnouncer;
