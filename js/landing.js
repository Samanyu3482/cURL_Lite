

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
  
    titleElement.textContent = text;
    titleElement.classList.remove("line-hidden");
    titleElement.classList.add("line-visible");
    await new Promise((resolve) => setTimeout(resolve, 2800)); 
  }

  async function hideLine() {
    titleElement.classList.remove("line-visible");
    titleElement.classList.add("line-hidden");
    await new Promise((resolve) => setTimeout(resolve, 500)); 
  }

  async function cycleLines() {
    while (true) {
      await showLine(lines[currentLineIndex]);
      await hideLine();
      currentLineIndex = (currentLineIndex + 1) % lines.length;
    }
  }

 
  titleElement.classList.add("line-hidden");
  cycleLines();
});
