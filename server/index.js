const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");
const fs = require("fs");
const quizController = require("../controllers/quizController");

const questions = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/questions.json")),
);

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
  res.render("selectQuestions", { totalQuestions: questions.length });
});

app.post("/start-quiz", (req, res) => {
  const numQuestions = parseInt(req.body.numQuestions);

  // shuffle questions
  const shuffledQuestions = shuffleArray([...questions]);

  // select specified num of q.
  const selectedQuestions = shuffledQuestions.slice(0, numQuestions);

  // store selected questions in session
  req.session.questions = selectedQuestions;
  req.session.totalQuestions = numQuestions;

  res.redirect("/question/0");
});

// Render individual questions
app.get("/question/:index", (req, res) => {
  const questionIndex = parseInt(req.params.index);
  const question = req.session.questions[questionIndex];

  if (question) {
    const shuffledChoices = shuffleArray([...question.choices]);
    res.render("question", {
      question,
      shuffledChoices: shuffledChoices,
      questionIndex: questionIndex,
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
  for (let i = 0; i < req.session.questions.length; i++) {
    const { userAnswer } = req.session.answers[i] || {};
    if (userAnswer === req.session.questions[i].choices[0]) {
      score++;
    }
  }
  res.render("result", {
    score: score,
    totalQuestions: req.session.questions.length,
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
