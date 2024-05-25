function handleQuizSubmission(req, res) {
  const questionIndex = parseInt(req.body.questionIndex);
  const userAnswer = req.body.answer;

  // Find the current question
  const currentQuestion = req.session.questions[questionIndex];

  if (currentQuestion) {
    // Save the user's answer
    req.session.answers = req.session.answers || {};
    req.session.answers[questionIndex] = {
      userAnswer,
      correctAnswer: currentQuestion.choices[0],
    };

    // Move to the next question or show the result
    if (questionIndex < req.session.totalQuestions - 1) {
      res.redirect(`/question/${questionIndex + 1}`);
    } else {
      res.redirect("/result");
    }
  } else {
    res.status(404).send("Question not Found");
  }
}

module.exports = {
  handleQuizSubmission,
};
