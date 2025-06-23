import React, { useState, useRef, useEffect } from 'react';
import './TypingTest.css';

const paragraphsList = [
  "Typing is a valuable skill that improves with consistent practice.",
  "It allows individuals to communicate quickly and efficiently, whether they're writing emails, coding, or creating content.",
  "A fast and accurate typist can save a significant amount of time and reduce errors.",
  "In today's digital age, the ability to type quickly and accurately is an essential skill that can significantly enhance productivity in both personal and professional tasks.",
  "Consistent typing practice not only builds muscle memory and speed but also reduces the mental strain associated with frequent text entry on computers and mobile devices.",
  "Whether drafting technical documentation or engaging in casual conversations online, strong typing skills empower users to express thoughts clearly and efficiently without being slowed down by frequent corrections.",
  "The efficiency gained through proficient typing translates to better time management, allowing individuals to focus more on critical thinking and less on the mechanics of writing.",
  "As remote work becomes more common, the demand for fast and precise typists continues to grow, making it a vital skill for anyone looking to thrive in a technology-driven world."
];

const getRandomParagraph = () => {
  const index = Math.floor(Math.random() * paragraphsList.length);
  return paragraphsList[index];
};

function Typing_test() {
  const [input, setInput] = useState('');
  const [started, setStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [charStatus, setCharStatus] = useState([]);
  const [accuracy, setAccuracy] = useState(100);
  const [strictMode, setStrictMode] = useState(true);
  const intervalRef = useRef(null);
  const inputRef = useRef(null);
  const [paragraphText, setParagraphText] = useState(getRandomParagraph());
  const [mistakes, setMistakes] = useState(0);

  useEffect(() => {
    if (started && timer === 0) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [started]);

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const calculateStats = (correct, totalTyped) => {
    const minutes = timer / 60 || 1 / 60;
    const newWpm = Math.round((correct / 5) / minutes);
    const newAccuracy = Math.round((correct / totalTyped) * 100) || 0;
    setWpm(newWpm);
    setAccuracy(newAccuracy);
  };

  const handleInput = (e) => {
    const value = e.target.value;
    setInput(value);
    if (!started) setStarted(true);

    let correct = 0;
    let mistakeCount = 0;
    let newStates = [];

    for (let i = 0; i < value.length; i++) {
      if (value[i] === paragraphText[i]) {
        correct++;
        newStates.push('correct');
      } else {
        mistakeCount++;
        newStates.push('incorrect');
      }
    }

    setCharStatus(newStates);
    setMistakes(mistakeCount);
    calculateStats(correct, value.length);

    if (value.length >= paragraphText.length) {
      stopTimer();
      if (inputRef.current) inputRef.current.disabled = true;
    }
  };

  const handleKeyDown = (e) => {
    if (
      strictMode &&
      (e.key === 'Backspace' || e.key === 'Delete') &&
      charStatus.length !== paragraphText.length
    ) {
      e.preventDefault();
    }
  };

  const restart = () => {
    setInput('');
    setTimer(0);
    setWpm(0);
    setAccuracy(100);
    setStarted(false);
    setCharStatus([]);
    setParagraphText(getRandomParagraph());
    setMistakes(0);

    clearInterval(intervalRef.current);
    intervalRef.current = null;
    if (inputRef.current) {
      inputRef.current.disabled = false;
      inputRef.current.focus();
    }
  };

  return (
    <div className='container'>
      <h1>Typing Speed Test</h1>

      <p id="text-display">
        {[...paragraphText].map((char, i) => {
          const className = charStatus[i];
          return (
            <span key={i} className={className}>
              {char}
            </span>
          );
        })}
      </p>

      <div className="progress-bar-container">
        <div
          className="progress-bar-filled"
          style={{ width: `${(input.length / paragraphText.length) * 100}%` }}
        ></div>
      </div>

      <textarea
        id="input-area"
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        placeholder="Start Typing"
      ></textarea>

      <div className="stats-container">
        <div className="stat-box">
          <h3>Time</h3>
          <p>{timer} sec</p>
        </div>
        <div className="stat-box">
          <h3>Speed</h3>
          <p>{wpm} WPM</p>
        </div>
        <div className="stat-box">
          <h3>Accuracy</h3>
          <p>{accuracy}%</p>
        </div>
        <div className="stat-box">
          <h3>Mistakes</h3>
          <p>{mistakes}</p>
        </div>
      </div>

      <button id="restart" onClick={restart}>Restart</button>

      <button
        id="mode"
        className={strictMode ? 'red-mode' : 'green-mode'}
        onClick={() => setStrictMode(!strictMode)}
      >
        {strictMode ? 'Strict Mode' : 'Free Mode'}
      </button>
    </div>
  );
}

export default Typing_test;
