import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faPause,
  faPlay,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";

function App() {
  const [sessionMinutes, setSessionMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);

  const [isplay, setIsPaused] = useState(false);
  const [mode, setMode] = useState("Session");
  const [secondsLeft, setSecondsLeft] = useState(1500);

  const isplayRef = useRef(isplay);
  const modeRef = useRef(mode);
  const secondsLeftRef = useRef(secondsLeft);

  function handleBreakDecrement() {
    if (breakMinutes > 1) {
      setBreakMinutes((value) => value - 1);
      if (mode === "Break") {
        secondsLeftRef.current = (sessionMinutes - 1) * 60;
        setSecondsLeft(secondsLeftRef.current);
      }
    }
  }

  function handleBreakIncrement() {
    if (breakMinutes < 60) {
      setBreakMinutes((value) => value + 1);
      if (mode === "Break") {
        secondsLeftRef.current = (sessionMinutes + 1) * 60;
        setSecondsLeft(secondsLeftRef.current);
      }
    }
  }

  function handleSessionDecrement() {
    if (sessionMinutes > 1) {
      setSessionMinutes((value) => value - 1);
      if (mode === "Session") {
        secondsLeftRef.current = (sessionMinutes - 1) * 60;
        setSecondsLeft(secondsLeftRef.current);
      }
    }
  }

  function handleSessionIncrement() {
    if (sessionMinutes < 60) {
      setSessionMinutes((value) => value + 1);
      if (mode === "Session") {
        secondsLeftRef.current = (sessionMinutes + 1) * 60;
        setSecondsLeft(secondsLeftRef.current);
      }
    }
  }

  function tick() {
    secondsLeftRef.current -= 1;
    setSecondsLeft(secondsLeftRef.current);

    if (secondsLeftRef.current === 0) {
      const audio = document.getElementById("beep");
      audio.play();
    }
  }

  useEffect(() => {
    function switchMode() {
      const nextMode = modeRef.current === "Session" ? "Break" : "Session";
      const nextSeconds =
        (nextMode === "Session" ? sessionMinutes : breakMinutes) * 60;

      modeRef.current = nextMode;
      setMode(nextMode);

      setSecondsLeft(nextSeconds);
      secondsLeftRef.current = nextSeconds;
    }

    const interval = setInterval(() => {
      if (!isplayRef.current) {
        return;
      }
      if (secondsLeftRef.current === 0) {
        return switchMode();
      }

      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [breakMinutes, setBreakMinutes, sessionMinutes, setSessionMinutes]);

  function handlePlay() {
    isplayRef.current = !isplayRef.current;
    setIsPaused(!isplay);
  }

  function handleReset() {
    setIsPaused(false);
    isplayRef.current = false;
    setMode("Session");
    modeRef.current = "Session";
    setSecondsLeft(1500);
    secondsLeftRef.current = 1500;
    setSessionMinutes(25);
    setBreakMinutes(5);
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
  }

  let minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  return (
    <div className="container">
      <h2>25 + 5 Clock</h2>
      <div className="length-control">
        <div>
          <div id="break-label">Break Length</div>
          <div className="buttons">
            <button
              id="break-decrement"
              disabled={isplay}
              onClick={handleBreakDecrement}
            >
              <FontAwesomeIcon className="icons" icon={faMinus} />
            </button>
            <div id="break-length">{breakMinutes}</div>
            <button
              id="break-increment"
              disabled={isplay}
              onClick={handleBreakIncrement}
            >
              <FontAwesomeIcon className="icons" icon={faPlus} />
            </button>
          </div>
        </div>
        <div>
          <div id="session-label">Session Length</div>
          <div className="buttons">
            <button
              id="session-decrement"
              disabled={isplay}
              onClick={handleSessionDecrement}
            >
              <FontAwesomeIcon className="icons" icon={faMinus} />
            </button>
            <div id="session-length">{sessionMinutes}</div>
            <button
              id="session-increment"
              disabled={isplay}
              onClick={handleSessionIncrement}
            >
              <FontAwesomeIcon className="icons" icon={faPlus} />
            </button>
          </div>
        </div>
      </div>
      <div className="timer">
        <div id="timer-label">{mode}</div>
        <div id="time-left">{minutes + ":" + seconds}</div>
      </div>
      <div className="timer-control">
        <button id="start_stop" onClick={handlePlay}>
          {isplay ? (
            <FontAwesomeIcon className="icons" icon={faPause} />
          ) : (
            <FontAwesomeIcon className="icons" icon={faPlay} />
          )}
        </button>
        <button id="reset" onClick={handleReset}>
          <FontAwesomeIcon className="icons" icon={faRotate} />
        </button>
      </div>
      <audio
        id="beep"
        preload="auto"
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
    </div>
  );
}

export default App;
