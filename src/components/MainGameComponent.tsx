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
  const [level, setLevel] = useState(1); // Add a level state

  // Define time limits for each level
  const levelTimeLimits = [30, 60, 120]; // Time limits for level 1, 2, and 3 respectively
  const maxTime = levelTimeLimits[level - 1]; // Set max time based on level

  // Timer logic
  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0) {
      // Automatically progress to the next level
      if (level < 3) {
        setLevel((prevLevel) => prevLevel + 1);
        setTimeLeft(levelTimeLimits[level]); // Reset time for the next level
        generateQuestion(level + 1); // Generate question for the next level
      } else {
        setIsGameActive(false); // End game if level 3 is reached
      }
    }
  }, [timeLeft, isGameActive, level]);

  // Generate random math question
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
      const selectedOperator = operators[Math.floor(Math.random() * operators.length)];
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
    setScore(0);
    setLives(3);
    setLevel(1); // Reset level to 1
    setTimeLeft(maxTime);
    setIsGameActive(true);
    generateQuestion(1); // Start with level 1
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (parseInt(input) === answer) {
      setScore(score + 1);
      generateQuestion(level); // Generate question for the current level
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
      <h1 className="text-3xl font-bold mb-6 text-center">
        Math Quest: Equation Explorer
      </h1>
      {isGameActive ? (
        <>
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-xl mb-2">Score: {score}</h2>
            <h2 className="text-xl mb-2">Time Left: {timeLeft}</h2>
            <h2 className="text-xl mb-2">Lives: {lives}</h2>
            <h2 className="text-xl mb-2">Level: {level}</h2>
          </div>

          {/* ShadCN Progress Bar for Time Left */}
          <Progress value={progressPercentage} className="w-[60%] h-4 mb-4" />

          <div className="question">
            <h2 className="text-2xl mb-4">{question}</h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center"
          >
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

// Not following BODMAS properly. For 9-5/5, its not accepting 8 as answer.

// "use client";

// import { useState, useEffect } from "react";
// import { Progress } from "./ui/progress"; // Adjust the import path as necessary

// type SubmitEvent = React.FormEvent<HTMLFormElement>;

// const MainGameComponent = () => {
//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState(0); // Ensuring answer is always a number
//   const [score, setScore] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(30);
//   const [input, setInput] = useState("");
//   const [isGameActive, setIsGameActive] = useState(false);
//   const [lives, setLives] = useState(3);
//   const [level, setLevel] = useState(1); // Add a level state

//   // Define time limits for each level
//   const levelTimeLimits = [30, 60, 120]; // Time limits for level 1, 2, and 3 respectively
//   const maxTime = levelTimeLimits[level - 1]; // Set max time based on level

//   // Timer logic
//   useEffect(() => {
//     if (isGameActive && timeLeft > 0) {
//       const timer = setInterval(() => {
//         setTimeLeft((prev) => prev - 1);
//       }, 1000);
//       return () => clearInterval(timer);
//     }
//     if (timeLeft === 0) {
//       // Automatically progress to the next level
//       if (level < 3) {
//         setLevel((prevLevel) => prevLevel + 1);
//         setTimeLeft(levelTimeLimits[level]); // Reset time for the next level
//         generateQuestion(level + 1); // Generate question for the next level
//       } else {
//         setIsGameActive(false); // End game if level 3 is reached
//       }
//     }
//   }, [timeLeft, isGameActive, level]);

//   // Generate random math question
//   const generateQuestion = (level: number) => {
//     let num1, num2, num3, num4, num5;
//     const operators = ["+", "-", "*", "/"];
//     let newAnswer: number = 0; // Initialize newAnswer as a number

//     switch (level) {
//       case 1:
//         // Level 1: Two numbers
//         num1 = Math.floor(Math.random() * 10) + 1; // 1-10
//         num2 = Math.floor(Math.random() * 10) + 1; // 1-10
//         break;
//       case 2:
//         // Level 2: Three numbers
//         num1 = Math.floor(Math.random() * 10) + 1;
//         num2 = Math.floor(Math.random() * 10) + 1;
//         num3 = Math.floor(Math.random() * 10) + 1;
//         break;
//       case 3:
//         // Level 3: Four or Five numbers
//         num1 = Math.floor(Math.random() * 10) + 1;
//         num2 = Math.floor(Math.random() * 10) + 1;
//         num3 = Math.floor(Math.random() * 10) + 1;
//         num4 = Math.floor(Math.random() * 10) + 1; // 1-10
//         num5 = Math.floor(Math.random() * 10) + 1; // 1-10
//         break;
//       default:
//         throw new Error("Invalid level");
//     }

//     // Randomly select an operator for the first two numbers
//     const selectedOperator1 = operators[Math.floor(Math.random() * operators.length)];

//     // Handle the division case separately to ensure it meets the criteria
//     if (selectedOperator1 === "/") {
//       // Ensure m / n where m % n === 0
//       num1 = Math.floor(Math.random() * 90) + 10; // m (10-100)
//       num2 = Math.floor(Math.random() * 9) + 1; // n (1-9)
//       num1 = num1 - (num1 % num2); // Make sure m is divisible by n
//       newAnswer = num1 / num2;
//       setQuestion(`${num1} / ${num2}`);
//     } else {
//       // For addition, subtraction, or multiplication
//       switch (selectedOperator1) {
//         case "+":
//           newAnswer = num1 + num2;
//           break;
//         case "-":
//           newAnswer = num1 - num2;
//           break;
//         case "*":
//           newAnswer = num1 * num2;
//           break;
//       }
//       setQuestion(`${num1} ${selectedOperator1} ${num2}`);
//     }

//     // Handle the case for three or more numbers
//     if (level > 1) {
//       const selectedOperator2 = operators[Math.floor(Math.random() * operators.length)];
//       // Here, you can combine the first operation with the next number
//       let intermediateAnswer = newAnswer; // Start with the previous answer
//       switch (selectedOperator2) {
//         case "+":
//           intermediateAnswer += num3; // Add next number
//           setQuestion((prev) => `${prev} + ${num3}`);
//           break;
//         case "-":
//           intermediateAnswer -= num3; // Subtract next number
//           setQuestion((prev) => `${prev} - ${num3}`);
//           break;
//         case "*":
//           intermediateAnswer *= num3; // Multiply next number
//           setQuestion((prev) => `${prev} * ${num3}`);
//           break;
//         case "/":
//           // Ensure divisibility for the next division
//           num3 = Math.floor(Math.random() * 90) + 10;
//           num4 = Math.floor(Math.random() * 9) + 1;
//           num3 = num3 - (num3 % num4);
//           intermediateAnswer = intermediateAnswer / num4;
//           setQuestion((prev) => `${prev} / ${num4}`);
//           break;
//       }
//       newAnswer = intermediateAnswer; // Update newAnswer with the intermediate answer
//     }

//     // Set final answer
//     setAnswer(newAnswer);
//   };

//   const startGame = () => {
//     setScore(0);
//     setLives(3);
//     setLevel(1); // Reset level to 1
//     setTimeLeft(maxTime);
//     setIsGameActive(true);
//     generateQuestion(1); // Start with level 1
//   };

//   const handleSubmit = (e: SubmitEvent) => {
//     e.preventDefault();
//     if (parseInt(input) === answer) {
//       setScore(score + 1);
//       generateQuestion(level); // Generate question for the current level
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
//       <h1 className="text-3xl font-bold mb-6 text-center">
//         Math Quest: Equation Explorer
//       </h1>
//       {isGameActive ? (
//         <>
//           <div className="flex flex-col items-center mb-4">
//             <h2 className="text-xl mb-2">Score: {score}</h2>
//             <h2 className="text-xl mb-2">Time Left: {timeLeft}</h2>
//             <h2 className="text-xl mb-2">Lives: {lives}</h2>
//             <h2 className="text-xl mb-2">Level: {level}</h2>
//           </div>

//           {/* ShadCN Progress Bar for Time Left */}
//           <Progress value={progressPercentage} className="w-[60%] h-4 mb-4" />

//           <div className="question">
//             <h2 className="text-2xl mb-4">{question}</h2>
//           </div>
//           <form
//             onSubmit={handleSubmit}
//             className="flex flex-col items-center"
//           >
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
