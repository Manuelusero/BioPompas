import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./SplashScreen.css";

const words = ["Reduce.","Refill.","Recycle."];

export default function SplashScreen({ onFinish }) {
  const [typedWords, setTypedWords] = useState([""]);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (wordIndex < words.length) {
      if (charIndex < words[wordIndex].length) {
        const timeout = setTimeout(() => {
          setTypedWords((prev) => {
            const updated = [...prev];
            updated[wordIndex] = (updated[wordIndex] || "") + words[wordIndex][charIndex];
            return updated;
          });
          setCharIndex((prev) => prev + 1);
        }, 120);
        return () => clearTimeout(timeout);
      } else if (wordIndex < words.length - 1) {
        // Start typing next word
        setTypedWords((prev) => [...prev, ""]);
        setCharIndex(0);
        setWordIndex((prev) => prev + 1);
      } else if (!finished) {
        // All words typed
        setFinished(true);
        setTimeout(() => {
          if (onFinish) onFinish();
        }, 1200);
      }
    }
  }, [charIndex, wordIndex, finished, onFinish]);

  return (
    <div className="splash-screen">
      <div className="splash-logo">
        <div className="logo-placeholder">
          <img src="/LogoBig.svg" alt="Logo" style={{ width: 360, height: 117.69 }} />
        </div>
      </div>
      <div className="splash-typewriter-final">
        {words.map((w, i) => (
          <span className="word-final" key={i}>
            {typedWords[i] || ""}
            {i === wordIndex && charIndex < words[wordIndex].length && <span className="splash-cursor">|</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

SplashScreen.propTypes = {
  onFinish: PropTypes.func
};
