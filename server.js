const express = require("express");
const app = express();
const path = require("path");

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Define your quiz questions and answers
const questions = [
  {
    question: "What is the capital of France?",
    choices: ["London", "Paris", "Berlin", "Madrid"],
    answer: "Paris",
  },
  {
    question: "What is the largest planet in our solar system?",
    choices: ["Mars", "Jupiter", "Saturn", "Neptune"],
    answer: "Jupiter",
  },
  // Add more questions...
];

// Render the quiz page
app.get("/", (req, res) => {
  res.render("quiz", { questions: questions });
});

// Handle quiz submission
app.post("/submit", (req, res) => {
  let score = 0;
  const userAnswers = req.body;

  // Check user answers against correct answers
  for (let i = 0; i < questions.length; i++) {
    if (userAnswers[`question${i}`] === questions[i].answer) {
      score++;
    }
  }

  // Render the result page with the user's score
  res.render("result", { score: score, totalQuestions: questions.length });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
