import React, { useState, useEffect, useRef } from 'react';

/**
 * Renders text with a typewriter effect + blinking cursor.
 * Props:
 *   text      – string to type
 *   speed     – ms per character (default 45)
 *   delay     – ms before starting (default 0)
 *   color     – text color
 *   style     – extra style overrides
 *   onDone    – callback when typing finishes
 *   cursor    – show cursor (default true)
 *   cursorChar– cursor character (default '|')
 */
function TypewriterText({ text = '', speed = 45, delay = 0, color, style = {}, onDone, cursor = true, cursorChar = '|' }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const idxRef = useRef(0);
  const timerRef = useRef(null);
  const blinkRef = useRef(null);

  // Reset when text changes
  useEffect(() => {
    setDisplayed('');
    setDone(false);
    idxRef.current = 0;

    const start = setTimeout(() => {
      timerRef.current = setInterval(() => {
        idxRef.current += 1;
        setDisplayed(text.slice(0, idxRef.current));
        if (idxRef.current >= text.length) {
          clearInterval(timerRef.current);
          setDone(true);
          if (onDone) onDone();
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(start);
      clearInterval(timerRef.current);
    };
  }, [text, speed, delay]);

  // Blinking cursor
  useEffect(() => {
    blinkRef.current = setInterval(() => {
      setCursorVisible(v => !v);
    }, 530);
    return () => clearInterval(blinkRef.current);
  }, []);

  return (
    <span style={{ ...style, color }}>
      {displayed}
      {cursor && (
        <span style={{
          display: 'inline-block',
          width: '2px',
          marginLeft: '1px',
          opacity: cursorVisible ? 1 : 0,
          transition: 'opacity 0.1s',
          color: color || 'inherit',
          fontWeight: 300,
        }}>
          {cursorChar}
        </span>
      )}
    </span>
  );
}

export default TypewriterText;
