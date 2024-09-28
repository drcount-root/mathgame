"use client";

import { useState, useEffect } from "react";

type SubmitEvent = React.FormEvent<HTMLFormElement>;

const MainGameComponent = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [input, setInput] = useState("");
  const [isGameActive, setIsGameActive] = useState(false);
  const [lives, setLives] = useState(3);

  // Timer logic
  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0) {
      setIsGameActive(false);
    }
  }, [timeLeft, isGameActive]);

  // Generate random math question
  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const newAnswer = num1 + num2;
    setQuestion(`${num1} + ${num2}`);
    setAnswer(newAnswer);
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setTimeLeft(30);
    setIsGameActive(true);
    generateQuestion();
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (parseInt(input) === answer) {
      setScore(score + 1);
      generateQuestion();
    } else {
      setLives(lives - 1);
      if (lives - 1 === 0) {
        setIsGameActive(false);
      }
    }
    setInput("");
  };

  return (
    <div className="App">
      <h1>Math Quest: Equation Explorer</h1>
      {isGameActive ? (
        <>
          <div className="game-info">
            <h2>Score: {score}</h2>
            <h2>Time Left: {timeLeft}</h2>
            <h2>Lives: {lives}</h2>
          </div>
          <div className="question">
            <h2>{question}</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              required
            />
            <button type="submit">Submit</button>
          </form>
        </>
      ) : (
        <>
          <button onClick={startGame}>Start Game</button>
          {timeLeft === 0 || lives === 0 ? (
            <h2>Game Over! Your score: {score}</h2>
          ) : null}
        </>
      )}
    </div>
  );
};

export default MainGameComponent;

