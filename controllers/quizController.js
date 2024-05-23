const questions = require("../data/quizData");

function handleQuizSubmission(req, res) {
  const questionId = parseInt(req.body.questionId);
  const userAnswer = req.body.answer;

  // find the current question
  const currentQuestion = questions.find((q) => q.id === questionId);

  if (userAnswer === currentQuestion.answer) {
    // answer is correct, so move to the next question or show result
    const nextQuestionId = questionId + 1;
    const nextQuestion = questions.find((q) => q.id === nextQuestionId);

    if (nextQuestion) {
      res.redirect(`/question/${nextQuestionId}`);
    } else {
      res.redirect("/result");
    }
  } else {
    res.send("Incorrect answer. Please try again");
  }
}

module.exports = {
  handleQuizSubmission,
};
