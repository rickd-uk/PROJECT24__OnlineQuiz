const questions = require("../data/quizData");

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function handleQuizSubmission(req, res) {
  const questionId = parseInt(req.body.questionId);
  const userAnswer = req.body.answer;

  // Find the current question
  const currentQuestion = questions.find((q) => q.id === questionId);

  // Shuffle the choices
  const shuffledChoices = shuffleArray([...currentQuestion.choices]);

  // Set the first choice as the answer
  const correctAnswer = currentQuestion.choices[0];

  // Save the user's answer
  req.session.answers = req.session.answers || {};
  req.session.answers[questionId] = {
    userAnswer,
    correctAnswer,
  };

  // Move to the next question or show the result
  const nextQuestionId = questionId + 1;
  const nextQuestion = questions.find((q) => q.id === nextQuestionId);

  if (nextQuestion) {
    res.redirect(`/question/${nextQuestion.id}`);
  } else {
    res.redirect("/result");
  }
}

module.exports = {
  handleQuizSubmission,
};
