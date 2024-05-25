document.addEventListener("DOMContentLoaded", () => {
  const quizSelect = document.getElementById("quizSelect");
  const numQuestions = document.getElementById("numQuestions");
  const decrementBtn = document.querySelector(".decrement");
  const incrementBtn = document.querySelector(".increment");

  const resetNumQuestions = () => {
    numQuestions.value = 5;
    numQuestions.max = 5;
  };

  const updateNumQuestions = (maxValue) => {
    numQuestions.max = maxValue;
    numQuestions.value = Math.min(5, maxValue);
  };

  resetNumQuestions();

  quizSelect.addEventListener("change", () => {
    const selectedQuiz = quizzes.find((quiz) => quiz.name === quizSelect.value);
    const maxQuestions = selectedQuiz ? selectedQuiz.questions.length : 0;

    if (maxQuestions === 0) {
      resetNumQuestions();
    } else {
      updateNumQuestions(maxQuestions);
    }
  });

  decrementBtn.addEventListener("click", () => {
    const currentValue = parseInt(numQuestions.value, 10);
    const newValue =
      currentValue > numQuestions.min ? currentValue - 1 : currentValue;
    numQuestions.value = newValue;
  });

  incrementBtn.addEventListener("click", () => {
    const currentValue = parseInt(numQuestions.value, 10);
    const newValue =
      currentValue < numQuestions.max ? currentValue + 1 : currentValue;
    numQuestions.value = newValue;
  });

  numQuestions.addEventListener("input", () => {
    const value = parseInt(numQuestions.value, 10);
    const maxValue = parseInt(numQuestions.max, 10);
    const minValue = parseInt(numQuestions.min, 10);

    if (isNaN(value)) {
      numQuestions.value = minValue;
    } else if (value > maxValue) {
      numQuestions.value = maxValue;
    } else if (value < minValue) {
      numQuestions.value = minValue;
    }
  });
});
