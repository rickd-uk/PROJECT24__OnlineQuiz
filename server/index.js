const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");
const fs = require("fs");
const quizController = require("../controllers/quizController");

const quizDir = path.join(__dirname, "../quizzes");

const quizzes = fs
  .readdirSync(quizDir)
  .filter((file) => file.endsWith(".json"))
  .map((file) => {
    const filePath = path.join(quizDir, file);
    const quizData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return {
      name: file.slice(0, -5),
      questions: quizData,
    };
  });
// const questions = JSON.parse(
//   fs.readFileSync(path.join(__dirname, "../data/questions.json")),
// );

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
  const maxQuestions = quizzes.reduce(
    (max, quiz) => Math.max(max, quiz.questions.length),
    0,
  );
  res.render("selectQuestions", { quizzes, maxQuestions });
});

app.post("/start-quiz", (req, res) => {
  const quizName = req.body.quizName;
  const numQuestions = parseInt(req.body.numQuestions);

  if (!quizName) {
    return res.status(404).send("Please select a quiz");
  }
  const selectedQuiz = quizzes.find((quiz) => quiz.name === quizName);
  if (!selectedQuiz) {
    return res.status(404).send("Quiz Not Found");
  }
  // shuffle questions
  const shuffledQuestions = shuffleArray([...selectedQuiz.questions]);

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
