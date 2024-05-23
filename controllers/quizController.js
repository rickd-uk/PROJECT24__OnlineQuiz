const questions = require("../data/quizData");

function handleQuizSubmission(req, res) {
  const questionId = parseInt(req.body.questionId);
  const userAnswer = req.body.answer;

  // find the current question
  const currentQuestion = questions.find((q) => q.id === questionId);

  // save the user's answer (session or database store is possible)
  req.session.answers = req.session.answers || {};
  req.session.answers[questionId] = userAnswer;

  const nextQuestionId = questionId + 1;
  const nextQuestion = questions.find((q) => q.id === nextQuestionId);

  if (nextQuestion) {
    res.redirect(`/question/${nextQuestionId}`);
  } else {
    res.redirect("/result");
  }
}

module.exports = {
  handleQuizSubmission,
};
