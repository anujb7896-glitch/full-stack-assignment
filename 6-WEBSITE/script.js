const jokeBox = document.getElementById("jokeBox");
const jokeBtn = document.getElementById("jokeBtn");

const API_URL = "https://official-joke-api.appspot.com/random_joke";

async function fetchJoke() {
  jokeBtn.disabled = true;
  jokeBox.textContent = "Loading a joke...";

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    jokeBox.innerHTML = "";

    const setupEl = document.createElement("div");
    setupEl.textContent = data.setup;

    const punchlineEl = document.createElement("div");
    punchlineEl.className = "punchline";
    punchlineEl.textContent = data.punchline;

    jokeBox.appendChild(setupEl);
    jokeBox.appendChild(punchlineEl);
  } catch (error) {
    jokeBox.textContent = "Could not fetch a joke right now. Please try again.";
  } finally {
    jokeBtn.disabled = false;
  }
}

jokeBtn.addEventListener("click", fetchJoke);

fetchJoke();