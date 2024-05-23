const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");
const questions = require("../data/quizData");
const quizController = require("../controllers/quizController");

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "../public")));

// Parse url-encoded bodies & JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "123",
    resave: false,
    saveUninitialized: true,
  }),
);

// Define the shuffleArray function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// render the first question
app.get("/", (req, res) => {
  res.redirect(`/question/${questions[0].id}`);
});

// Render individual questions
app.get("/question/:id", (req, res) => {
  const questionId = parseInt(req.params.id);
  const question = questions.find((q) => q.id === questionId);

  if (question) {
    const shuffledChoices = shuffleArray([...question.choices]);
    res.render("question", {
      question: question,
      shuffledChoices: shuffledChoices,
    });
  } else {
    res.status(404).send("Question not found");
  }
});

// Handle quiz submission
app.post("/submit", quizController.handleQuizSubmission);

//render result page
app.get("/result", (req, res) => {
  // calculate the score based on user's answers
  let score = 0;
  for (const questionId in req.session.answers) {
    const { userAnswer, correctAnswer } = req.session.answers[questionId];
    if (userAnswer === correctAnswer) {
      score++;
    }
  }
  res.render("result", { score: score, totalQuestions: questions.length });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
