document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const submitBtn = document.getElementById("submitBtn");
  const statusEl = document.getElementById("status");

  function showStatus(text, isError = false) {
    statusEl.textContent = text;
    statusEl.style.display = "block";
    statusEl.style.color = isError ? "#dc2626" : "#059467";
  }

  function validate(name, email, message) {
    if (!name || !email || !message) {
      showStatus("Please fill in all fields", true);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus("Invalid email address", true);
      return false;
    }

    return true;
  }

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!validate(name, email, message)) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    chrome.storage.local.get(["submissions"], (result) => {
      const submissions = result.submissions || [];

      submissions.push({
        id: Date.now(),
        name,
        email,
        message,
        timestamp: new Date().toLocaleString()
      });

      chrome.storage.local.set({ submissions }, () => {
        showStatus("Submitted successfully!");

        // Open dashboard (options page)
        chrome.tabs.create({
          url: chrome.runtime.getURL("options.html")
        });

        // Reset form
        nameInput.value = "";
        emailInput.value = "";
        messageInput.value = "";
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
      });
    });
  });
});
