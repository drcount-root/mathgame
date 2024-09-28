"use client";

import { useState, useEffect } from "react";
import { Progress } from "./ui/progress"; // Adjust the import path as necessary

type SubmitEvent = React.FormEvent<HTMLFormElement>;

const MainGameComponent = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(0); // Ensuring answer is always a number
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [input, setInput] = useState("");
  const [isGameActive, setIsGameActive] = useState(false);
  const [lives, setLives] = useState(3);

  const maxTime = 30; // Maximum time for the game

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
    const operators = ["+", "-", "*", "/"];
    const selectedOperator =
      operators[Math.floor(Math.random() * operators.length)];

    let newAnswer: number = 0; // Initialize newAnswer as a number

    switch (selectedOperator) {
      case "+":
        newAnswer = num1 + num2;
        break;
      case "-":
        newAnswer = num1 - num2;
        break;
      case "*":
        newAnswer = num1 * num2;
        break;
      case "/":
        const divisibleNum1 = num1 * num2;
        newAnswer = divisibleNum1 / num2;
        setQuestion(`${divisibleNum1} / ${num2}`);
        break;
      default:
        // Ensure default case sets some valid question and answer
        newAnswer = num1 + num2; // Default to addition in case of an error
        setQuestion(`${num1} + ${num2}`);
        break;
    }

    if (selectedOperator !== "/") {
      setQuestion(`${num1} ${selectedOperator} ${num2}`);
    }

    setAnswer(newAnswer); // Set answer to a valid number
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setTimeLeft(maxTime);
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

  // Calculate progress for the progress bar
  const progressPercentage = (timeLeft / maxTime) * 100;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">Math Quest: Equation Explorer</h1>
      {isGameActive ? (
        <>
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-xl mb-2">Score: {score}</h2>
            <h2 className="text-xl mb-2">Time Left: {timeLeft}</h2>
            <h2 className="text-xl mb-2">Lives: {lives}</h2>
          </div>

          {/* ShadCN Progress Bar for Time Left */}
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
            <h2 className="text-2xl mt-6">Game Over! Your score: {score}</h2>
          ) : null}
        </>
      )}
    </div>
  );
};

export default MainGameComponent;

// "use client";

// import { useState, useEffect } from "react";
// import { Progress } from "./ui/progress";

// type SubmitEvent = React.FormEvent<HTMLFormElement>;

// const MainGameComponent = () => {
//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState(0); // Ensuring answer is always a number
//   const [score, setScore] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(30);
//   const [input, setInput] = useState("");
//   const [isGameActive, setIsGameActive] = useState(false);
//   const [lives, setLives] = useState(3);

//   const maxTime = 30; // Maximum time for the game

//   // Timer logic
//   useEffect(() => {
//     if (isGameActive && timeLeft > 0) {
//       const timer = setInterval(() => {
//         setTimeLeft((prev) => prev - 1);
//       }, 1000);
//       return () => clearInterval(timer);
//     }
//     if (timeLeft === 0) {
//       setIsGameActive(false);
//     }
//   }, [timeLeft, isGameActive]);

//   // Generate random math question
//   const generateQuestion = () => {
//     const num1 = Math.floor(Math.random() * 10) + 1;
//     const num2 = Math.floor(Math.random() * 10) + 1;
//     const operators = ["+", "-", "*", "/"];
//     const selectedOperator =
//       operators[Math.floor(Math.random() * operators.length)];

//     let newAnswer: number = 0; // Initialize newAnswer as a number

//     switch (selectedOperator) {
//       case "+":
//         newAnswer = num1 + num2;
//         break;
//       case "-":
//         newAnswer = num1 - num2;
//         break;
//       case "*":
//         newAnswer = num1 * num2;
//         break;
//       case "/":
//         const divisibleNum1 = num1 * num2;
//         newAnswer = divisibleNum1 / num2;
//         setQuestion(`${divisibleNum1} / ${num2}`);
//         break;
//       default:
//         // Ensure default case sets some valid question and answer
//         newAnswer = num1 + num2; // Default to addition in case of an error
//         setQuestion(`${num1} + ${num2}`);
//         break;
//     }

//     if (selectedOperator !== "/") {
//       setQuestion(`${num1} ${selectedOperator} ${num2}`);
//     }

//     setAnswer(newAnswer); // Set answer to a valid number
//   };

//   const startGame = () => {
//     setScore(0);
//     setLives(3);
//     setTimeLeft(maxTime);
//     setIsGameActive(true);
//     generateQuestion();
//   };

//   const handleSubmit = (e: SubmitEvent) => {
//     e.preventDefault();
//     if (parseInt(input) === answer) {
//       setScore(score + 1);
//       generateQuestion();
//     } else {
//       setLives(lives - 1);
//       if (lives - 1 === 0) {
//         setIsGameActive(false);
//       }
//     }
//     setInput("");
//   };

//   // Calculate progress for the progress bar
//   const progressPercentage = (timeLeft / maxTime) * 100;

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <h1 className="text-3xl font-bold mb-6">Math Quest: Equation Explorer</h1>
//       {isGameActive ? (
//         <>
//           <div className="flex flex-col items-center mb-4">
//             <h2 className="text-xl mb-2">Score: {score}</h2>
//             <h2 className="text-xl mb-2">Time Left: {timeLeft}</h2>
//             <h2 className="text-xl mb-2">Lives: {lives}</h2>
//           </div>

//           {/* Timer Progress Bar */}
//           <div className="w-full h-4 bg-gray-300 rounded-full mb-4 overflow-hidden">
//             <div
//               className="h-full bg-green-500 transition-all duration-500"
//               style={{ width: `${progressPercentage}%` }}
//             ></div>
//           </div>

//           <div className="question">
//             <h2 className="text-2xl mb-4">{question}</h2>
//           </div>
//           <form onSubmit={handleSubmit} className="flex flex-col items-center">
//             <input
//               type="number"
//               className="border border-gray-300 p-2 mb-4"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               required
//             />
//             <button
//               type="submit"
//               className="bg-blue-500 text-white px-4 py-2 rounded"
//             >
//               Submit
//             </button>
//           </form>
//         </>
//       ) : (
//         <>
//           <button
//             onClick={startGame}
//             className="bg-blue-500 text-white px-6 py-3 rounded mt-8"
//           >
//             Start Game
//           </button>
//           {timeLeft === 0 || lives === 0 ? (
//             <h2 className="text-2xl mt-6">Game Over! Your score: {score}</h2>
//           ) : null}
//         </>
//       )}
//     </div>
//   );
// };

// export default MainGameComponent;
