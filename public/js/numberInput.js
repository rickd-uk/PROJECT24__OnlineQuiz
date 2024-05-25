document.addEventListener("DOMContentLoaded", function () {
  const input = document.querySelector(".number-input");
  const decrementBtn = input.parentNode.querySelector(".decrement");
  const incrementBtn = input.parentNode.querySelector(".increment");
  const min = parseInt(input.getAttribute("min"), 10) || 1;
  const max = parseInt(input.getAttribute("max"), 10) || Infinity;

  decrementBtn.addEventListener("click", function () {
    let value = parseInt(input.value, 10);
    if (isNaN(value) || value <= min) {
      value = min;
    } else {
      value--;
    }
    input.value = value;
  });

  incrementBtn.addEventListener("click", function () {
    let value = parseInt(input.value, 10);
    if (isNaN(value) || value >= max) {
      value = max;
    } else {
      value++;
    }
    input.value = value;
  });
});
