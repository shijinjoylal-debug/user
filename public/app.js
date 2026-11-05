const form = document.querySelector("#username-form");
const usernameInput = document.querySelector("#username");
const message = document.querySelector("#form-message");
const submitButton = form.querySelector("button");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";
  message.classList.remove("error");
  submitButton.disabled = true;

  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: usernameInput.value })
    });
    const responseText = await response.text();
    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error(
        `The server returned an unexpected response (HTTP ${response.status}). Check the Vercel deployment and API configuration.`
      );
    }

    if (!response.ok) {
      throw new Error(result.error || "Could not save your username.");
    }

    message.textContent = "You're in. Your username has been saved.";
    form.reset();
  } catch (error) {
    message.textContent = error.message || "Something went wrong. Please try again.";
    message.classList.add("error");
  } finally {
    submitButton.disabled = false;
  }
});
