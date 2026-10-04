

document.addEventListener("DOMContentLoaded", () => {
  const lines = [
    "Building a simple visual API playground for developers",
    "Send, inspect, and track HTTP requests — right in your browser",
    "A lightweight tool to test APIs without leaving the tab",
    "Watch your requests go from pending to fulfilled, live",
    "No backend, no setup — just fetch, inspect, repeat"
  ];

  const titleElement = document.getElementById("animated-hero-title");
  if (!titleElement) return;

  let currentLineIndex = 0;

  async function showLine(text) {
    // Set text and fade in
    titleElement.textContent = text;
    titleElement.classList.remove("line-hidden");
    titleElement.classList.add("line-visible");
    await new Promise((resolve) => setTimeout(resolve, 2800)); // Stay visible 2.8s
  }

  async function hideLine() {
    titleElement.classList.remove("line-visible");
    titleElement.classList.add("line-hidden");
    await new Promise((resolve) => setTimeout(resolve, 500)); // Match CSS fade-out duration
  }

  async function cycleLines() {
    while (true) {
      await showLine(lines[currentLineIndex]);
      await hideLine();
      currentLineIndex = (currentLineIndex + 1) % lines.length;
    }
  }

  // Start hidden, then begin cycle
  titleElement.classList.add("line-hidden");
  cycleLines();
});
