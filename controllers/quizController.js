const questions = require("../data/quizData");

function handleQuizSubmission(req, res) {
  let score = 0;
  const userAnswers = req.body;

  // check user answers against correct answers
  for (let i = 0; i < questions.length; i++) {
    if (userAnswers[`question${i}`] === questions[i].answer) {
      score++;
    }
  }

  res.render("result", { score: score, totalQuestions: question.length });
}

module.exports = {
  handleQuizSubmission,
};
