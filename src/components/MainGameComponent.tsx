"use client";

import { useState, useEffect } from "react";
import { Progress } from "./ui/progress"; // Adjust the import path as necessary
import { useSession } from "next-auth/react";

type SubmitEvent = React.FormEvent<HTMLFormElement>;

const MainGameComponent = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(0);
  const [totalScore, setTotalScore] = useState(0); // Track total cumulative score
  const [levelScore, setLevelScore] = useState(0); // Track score for the current level
  const [timeLeft, setTimeLeft] = useState(10);
  const [input, setInput] = useState("");
  const [isGameActive, setIsGameActive] = useState(false);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [levelScores, setLevelScores] = useState<number[]>([]); // Store level-wise scores
  const [message, setMessage] = useState<string>("");
  const { data: session } = useSession();

  const levelTimeLimits = [10, 10, 10]; // Time limits for each level
  const maxTime = levelTimeLimits[level - 1];

  // Handle timer and level transitions
  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0) {
      if (level < 3) {
        setLevelScores((prev) => [...prev, levelScore]); // Store score for the current level
        setLevelScore(0); // Reset level score for the next level
        setLevel((prevLevel) => prevLevel + 1);
        setTimeLeft(levelTimeLimits[level]);
        generateQuestion(level + 1);
      } else {
        // Store final level score and stop the game without adding an extra score
        if (levelScores.length < 3) {
          setLevelScores((prev) => [...prev, levelScore]); // Store final level score
        }

        if (levelScores.length === 3) {
          saveScoresFunction();
        }

        setIsGameActive(false); // End game if level 3 is reached
      }
    }
  }, [timeLeft, isGameActive, level, levelScore]);

  const saveScoresFunction = async () => {
    if (session?.user) {
      try {
        const response = await fetch("/api/user/scores", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scores: levelScores.map((score, index) => ({
              level: index + 1,
              score: score,
            })),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update scores");
        }

        const data = await response.json();
        setMessage("Scores updated successfully!");
        console.log("Scores updated:", data.scores);
      } catch (error) {
        console.error("Error updating scores:", error);
        setMessage("Failed to update scores. Please try again.");
      }
    } else {
      setMessage("Sign in to save your scores!");
    }
  };

  const generateQuestion = (level: number) => {
    let numbers: number[] = [];
    const operators = ["+", "-", "*", "/"];
    let newAnswer: number = 0; // Initialize newAnswer as a number

    // Generate numbers and operators based on the level
    const numCount = level + 1; // Level 1: 2 numbers, Level 2: 3 numbers, Level 3: 4 or 5 numbers
    for (let i = 0; i < numCount; i++) {
      let randomNum;
      if (i > 0 && Math.random() < 0.5) {
        // Avoiding zero to prevent division errors
        randomNum = Math.floor(Math.random() * 10) + 1;
      } else {
        randomNum = Math.floor(Math.random() * 10) + 1; // Numbers between 1-10
      }
      numbers.push(randomNum);
    }

    // Create a mathematical expression using the generated numbers
    let expression = `${numbers[0]}`; // Start with the first number

    for (let i = 1; i < numCount; i++) {
      // Randomly select an operator
      const selectedOperator =
        operators[Math.floor(Math.random() * operators.length)];
      expression += ` ${selectedOperator} ${numbers[i]}`;

      // Evaluate the expression while ensuring proper handling of division
      if (selectedOperator === "/") {
        // Ensure the previous result is divisible by this number
        const previousNum = numbers[i - 1];
        const nextNum = numbers[i];
        if (previousNum % nextNum === 0) {
          newAnswer = eval(expression); // Safely evaluate the expression
        } else {
          // If not divisible, regenerate the question
          generateQuestion(level);
          return; // Exit to avoid further execution
        }
      } else {
        newAnswer = eval(expression); // Safely evaluate the expression
      }
    }

    // Set question and answer
    setQuestion(expression);
    setAnswer(newAnswer);
  };

  const startGame = () => {
    setMessage("");
    setTotalScore(0); // Reset total score
    setLevelScore(0); // Reset level score
    setLives(3);
    setLevel(1);
    setLevelScores([]); // Reset level-wise scores
    setTimeLeft(maxTime);
    setIsGameActive(true);
    generateQuestion(1);
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (parseInt(input) === answer) {
      setTotalScore(totalScore + 1); // Update total score
      setLevelScore(levelScore + 1); // Update current level's score
      generateQuestion(level);
    } else {
      setLives(lives - 1);
      if (lives - 1 === 0) {
        // Ensure no extra level is added if lives run out at level 3
        if (levelScores.length < 3) {
          setLevelScores((prev) => [...prev, levelScore]); // Store final level score
        }
        setIsGameActive(false);
      }
    }
    setInput("");
  };

  const progressPercentage = (timeLeft / maxTime) * 100;

  console.log("levelScores", levelScores);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Math Quest: Equation Explorer
      </h1>
      {isGameActive ? (
        <>
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-xl mb-2">Total Score: {totalScore}</h2>
            <h2 className="text-xl mb-2">Time Left: {timeLeft}</h2>
            <h2 className="text-xl mb-2">Lives: {lives}</h2>
            <h2 className="text-xl mb-2">Level: {level}</h2>
            <h2 className="text-xl mb-2">Level Score: {levelScore}</h2>
          </div>

          <Progress value={progressPercentage} className="w-[60%] h-4 mb-4" />

          <div className="question">
            <h2 className="text-2xl mb-4">{question}</h2>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <input
              type="number"
              className="border border-gray-300 p-2 mb-4"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </form>
        </>
      ) : (
        <>
          <button
            onClick={startGame}
            className="bg-blue-500 text-white px-6 py-3 rounded mt-8"
          >
            Start Game
          </button>
          {timeLeft === 0 || lives === 0 ? (
            <div className="mt-6">
              <h2 className="text-2xl">
                Game Over! Your total score: {totalScore}
              </h2>
              <h3 className="text-xl mt-4">Level-wise Scores:</h3>
              <ul>
                {levelScores.map((levelScore, index) => (
                  <li key={index} className="text-lg">
                    Level {index + 1}: {levelScore}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default MainGameComponent;