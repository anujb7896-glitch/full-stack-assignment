const countryInput = document.getElementById("countryInput");
const searchBtn = document.getElementById("searchBtn");
const statusEl = document.getElementById("status");
const resultsBody = document.getElementById("resultsBody");

async function fetchUniversities() {
  const country = countryInput.value.trim();

  if (!country) {
    statusEl.textContent = "Please enter a country name.";
    resultsBody.innerHTML = "";
    return;
  }

  searchBtn.disabled = true;
  statusEl.textContent = `Fetching universities in "${country}"...`;
  resultsBody.innerHTML = "";

  try {
    const url = `http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const universities = await response.json();

    if (universities.length === 0) {
      statusEl.textContent = `No universities found for "${country}".`;
      return;
    }

    statusEl.textContent = `Found ${universities.length} universities in ${country}.`;

    universities.forEach((uni, index) => {
      const row = document.createElement("tr");

      const numCell = document.createElement("td");
      numCell.textContent = index + 1;

      const nameCell = document.createElement("td");
      nameCell.textContent = uni.name;

      const stateCell = document.createElement("td");
      stateCell.textContent = uni["state-province"] || "N/A";

      const webCell = document.createElement("td");
      if (uni.web_pages && uni.web_pages.length > 0) {
        const link = document.createElement("a");
        link.href = uni.web_pages[0];
        link.textContent = uni.web_pages[0];
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        webCell.appendChild(link);
      } else {
        webCell.textContent = "N/A";
      }

      row.appendChild(numCell);
      row.appendChild(nameCell);
      row.appendChild(stateCell);
      row.appendChild(webCell);

      resultsBody.appendChild(row);
    });
  } catch (error) {
    statusEl.textContent =
      "Error fetching data. Make sure you open this page over HTTP (not HTTPS) since the Hipolabs API uses HTTP.";
  } finally {
    searchBtn.disabled = false;
  }
}

searchBtn.addEventListener("click", fetchUniversities);
countryInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    fetchUniversities();
  }
});