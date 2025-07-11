import React, { useState, useRef, useEffect } from 'react';//The React library is a bundle of prewritten JavaScript code inside the react package which is .useref-y used to control or access DOM elements directly in React. usestate-to store and update dynamic values (like time, input text, etc.)useeffect-to perform side effects like starting a timer
import './TypingTest.css';// Hooks are named exports, not part of the default React object
//Here's what happens inside the React package:

// Inside the 'react' library source:               in class component=> it can be directly used as this.state inside a constructor..
//export const useState = () => { ... }    the methos of using the features of react in the funcional component is called hook 
//export const useEffect = () => { ... }
//export const useRef = () => { ... }
//const React = {
  //createElement,
  //Component,
  //Fragment,
  //Children,
  // BUT: it does not include useState, useEffect by default
//};

//export default React;  👈 this is what you get with: import React from 'react';

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

const getRandomParagraph = () => {//random index number to pick one paragraph from the array.
  const index = Math.floor(Math.random() * paragraphsList.length);//Math.random() → gives a random decimal between 0 and 1.Math.random() * paragraphsList.length → gives a random decimal between 0 and the length (e.g., 0 to 7.99 if there are 8 paragraphs).ath.floor(...) → rounds it down
  return paragraphsList[index];
};//the above are like constant logic that needs to be defined once.

function Typing_test() {
  const [input, setInput] = useState('');//input holds the current value setInput() is used to update the value📌 Starts with an empty string ('')
  const [started, setStarted] = useState(false);//Tracks whether the typing test has started. false means the test hasn't started yet.Turns true when the user starts typing.
  const [timer, setTimer] = useState(0);// to store the elapsed time — that means how many seconds have passed since the typing test started.
  const [wpm, setWpm] = useState(0);//Stores the Words Per Minute calculated during the test.
  const [charStatus, setCharStatus] = useState([]);//This variable will store the status of each character the user types — whether it’s correct or incorrect.


  const [accuracy, setAccuracy] = useState(100);// Stores the typing accuracy percentage.
  const [strictMode, setStrictMode] = useState(true);//Determines if strict mode is ON.If true, the user might not be allowed to backspace.
  const intervalRef = useRef(null);//paves the way to access the dom element-timer
  const inputRef = useRef(null);//-input
  const [paragraphText, setParagraphText] = useState(getRandomParagraph());//Starts with a random paragraph chosen using getRandomParagraph()
  const [mistakes, setMistakes] = useState(0);//racks the number of mistakes the user makes while typing.

  useEffect(() => {//makes an effect
    if (started && timer === 0) {//This ensures the timer starts only once, at the beginning of the test.

      intervalRef.current = setInterval(() => {// id stored as intervalRef = {current: 1234} so that 🔒 intervalRef.current remains the same — it still holds the original ID returned by setInterval.if directly stored as intervalRef=val it may change the value during rerendering
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);// this is just for safe purpose ensuring  before setting another timer.so,If an old timer exists, the cleanup (return) runs first, and then the new if block runs to set a new one.
  }, [started]);//useEffect detects that the dependency (started) has changed.

//Before doing anything else, it runs the cleanup function:
//clearInterval(intervalRef.current);  // ✅ stops the existing timer
//Then the useEffect body runs again, but this time:
//Since started === false, the condition if (started && timer === 0) fails
//So the timer is not restarted
// ❗ No new timer starts unless started === true && timer === 0

  const stopTimer = () => {// this is to stop the timer manually
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

  const handleInput = (e) => {// only first time started can be detected. if once we cimpleted the test the timer alone stops andagain we should reattemp the test by restart button .if we restatr the stated automatcally set to false and again started is changed to true and  and loops


//80-86 then 51-56
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
      charStatus.length !== paragraphText.length //Character typed	What happens
//h	Full handleInput() runs for 'h'
//e	Full handleInput() runs for 'he'
//l	Full handleInput() runs for 'hel'
//l	Full handleInput() runs for 'hell'
//o	Full handleInput() runs for 'hello' → detects full length → stops timer and disables input beacuse,handleInput is a function tied to the input field's onChange
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

    clearInterval(intervalRef.current);//because if the user clicks restarts without completing the test
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
