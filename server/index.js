const express = require("express");
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

// render the first question
app.get("/", (req, res) => {
  res.redirect(`/question/${questions[0].id}`);
});

// render individual questions
app.get("/question/:id", (req, res) => {
  const questionId = parseInt(req.params.id);
  const question = questions.find((q) => q.id === questionId);

  if (question) {
    res.render("question", { question: question });
  } else {
    res.status(404).send("question not found");
  }
});

// Handle quiz submission
app.post("/submit", quizController.handleQuizSubmission);

//render result page
app.get("/result", (req, res) => {
  res.render("result");
});
// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
