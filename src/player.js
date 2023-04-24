import React, { useState, useRef, useEffect } from 'react';
import { toast } from "react-toastify";

function Quiz() {
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questions] = useState([
    {
      question: 'Unscramble the word "Remote"',
      answer: 'meteor',
      hint: 'Rearrange the letters of the word "remote" to form a word related to space'
    },
    {
      question: 'find the name of full moon that would occur in the coming month',
      answer: 'flower moon',
    },
    {
      question: "what would a alien with 3 eyes be called?",
      answer: 'aliiien',
      hint: "focus on number of i's"
    },
    {
      question : "its an alien language code. Decode it ⎍ ⎎⍜⎍⋏⎅ ⏁⊑⟒ ⏁⍀⟒⏃⌇⎍⍀⟒",
      answer: 'u found the treasure',
    }
  ]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [elapsedTime, setTimeElapsed] = useState(0);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [quizState, setQuizState] = useState("notStarted");
  const [endTime, setEndTime] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (quizState === "started") {
      intervalRef.current = setInterval(() => {
        setTimeElapsed((prevTimeElapsed) => prevTimeElapsed + 1);
      }, 1000);
    }
    if (quizState === "ended") {
      clearInterval(intervalRef.current); // clear the interval to stop the timer
    }
  }, [quizState]);

  const handleAnswerSubmit = (event) => {
    event.preventDefault();
    if (currentQuestion === 3) {
      setTimeElapsed((prevElapsedTime) => prevElapsedTime);
      setIsGameOver(true);
      clearInterval(intervalRef.current);
    }
    if (answer.toLowerCase() === questions[currentQuestion].answer) {
      toast.success("You got it right!");
      setScore(score + 1);
      setCurrentQuestion(currentQuestion + 1);
      setAnswer('');
    }
    else {
      toast.error('Sorry, that is not correct.');
      setWrongAnswersCount((prevCount) => prevCount + 1);
      if (wrongAnswersCount === 2) {
        quizState("ended");
        clearInterval(intervalRef.current);
      }
    }
  };

  const handleStartClick = () => {
    setQuizState("Started");
    intervalRef.current = setInterval(() => {
      setTimeElapsed((prevElapsedTime) => prevElapsedTime + 1);
    }, 10);
  };

  const handleEndClick = () => {
    clearInterval(intervalRef.current); // clear the interval to stop the timer
    setQuizState("ended"); // change the quiz state to "ended"
    setEndTime(new Date().toLocaleTimeString()); // set the end time using current time
  };


  const handleResetClick = () => {
    setQuizState("notStarted");
    clearInterval(intervalRef.current);
    setTimeElapsed(0);
    setScore(0);
    setCurrentQuestion(0);
    setWrongAnswersCount(0);
    setEndTime(null);
  };

  return (
    <div style={{ fontSize: "20px", fontFamily: "cursive", color: "white", textAlign: "center" }} className="container">
      <h2 style={{ textAlign: "center", marginTop: "20px" }}>So, Lets Start! Answer all the questions to find the treasure. U will be awarded score for completing each level</h2>
      <br></br>
      {!isGameOver ? (
        <>
      {quizState === "Started" && (
        <div className="container" style={{ textAlign: "center" }}>
          <p>{questions[currentQuestion].question} {questions[currentQuestion].hint && <span>(Hint: {questions[currentQuestion].hint})</span>}</p>
          {currentQuestion === 1 && (
            <a href="https://www.space.com/" target="_blank"  rel="noopener noreferrer" style={{ color: 'black' }}>click here for hint</a>
          )}
          {currentQuestion === 3 && (
            <a href="https://www.dcode.fr/alien-language" target="_blank"  rel="noopener noreferrer" style={{ color: 'black' }}>click here for hint</a>
          )}
          <form onSubmit={handleAnswerSubmit}>
            <label htmlFor="riddle-answer">Your answer:</label>
            <input
              type="text"
              id="riddle-answer"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
      {quizState === "notStarted" && (
        <div className="container" style={{ textAlign: "center" }}>
          <p>Click the Start button to begin.</p>
          <button onClick={handleStartClick}>Start</button>
        </div>
      )}
      <div className="container" style={{ textAlign: "center" }}>
        <p>Score: {score}</p>
        <p>Time: {elapsedTime / 100}s</p>
        {wrongAnswersCount === 3 && (
          <div>
            <p>You have reached the maximum number of wrong answers. Click on end game.</p>
            <button onClick={handleEndClick}>End Game</button>
          </div>
        )}
      </div>
      {quizState === "ended" && endTime !== null && (
        <div className="container" style={{ textAlign: "center" }}>
          <h3>Game ended!</h3>
          <p>Your final score is {score}.</p>
          <p>You finished the quiz at {endTime}.</p>
        </div>
      )}
      {quizState !== "notStarted" && (
        <button onClick={handleResetClick}>Reset Game</button>
      )}
      </>
      ):(
        <div className="container" style={{ textAlign: "center" }}>
        <h3>Game ended!</h3>
        <p>Your final score is {score}.</p>
        <p>You finished the quiz in {elapsedTime/100} seconds.</p>
        <p>Refresh the page to start the quiz again.</p>
      </div>
      )
    }
    </div>
  );
}

export default Quiz;
