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

// render the quiz page
app.get("/", (req, res) => {
  res.render("quiz", { questions: questions });
});


// Handle quiz submission
app.post("/submit", quizController.handleQuizSubmission);
  

  // Render the result page with the user's score
  res.render("result", { score: score, totalQuestions: questions.length });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
