document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("kleeInput");
  const button = document.getElementById("enlargeButton");
  const output = document.getElementById("bigText");

  if (!input || !button || !output) {
    return;
  }

  button.addEventListener("click", () => {
    const text = input.value.trim();
    if (text.length === 0) {
      output.textContent = "ここに入力したテキストが表示されます。";
      output.style.opacity = "0.7";
      return;
    }

    output.textContent = text;
    output.style.opacity = "1";
  });
});
