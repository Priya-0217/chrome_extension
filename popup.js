document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const submitBtn = document.getElementById("submitBtn");
  const statusEl = document.getElementById("status");

  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .success-animation {
      animation: fadeIn 0.3s ease-out;
    }
  `;
  document.head.appendChild(style);

  function showStatus(text, isError = false) {
    statusEl.textContent = text;
    statusEl.style.display = "block";
    statusEl.style.color = isError ? "#dc2626" : "#059467";
    statusEl.classList.add('success-animation');
    
    if (!isError) {
      setTimeout(() => {
        statusEl.textContent = "";
        statusEl.style.display = "none";
        statusEl.classList.remove('success-animation');
      }, 1500);
    }
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

  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!validate(name, email, message)) return;

    // Disable and show loading state
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Submitting...";
    submitBtn.style.opacity = "0.7";

    try {
      // Get existing submissions
      const result = await new Promise(resolve => {
        chrome.storage.local.get(["submissions"], resolve);
      });
      
      const submissions = result.submissions || [];

      // Add new submission
      submissions.push({
        id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        message,
        timestamp: new Date().toISOString()
      });

      // Save to storage
      await new Promise(resolve => {
        chrome.storage.local.set({ submissions }, resolve);
      });

      // Show success
      showStatus("✓ Success! Opening dashboard...");

      // Open dashboard after a short delay
      setTimeout(() => {
        chrome.tabs.create({
          url: chrome.runtime.getURL("options.html"),
          active: true
        });
      }, 500);

      // Reset form
      nameInput.value = "";
      emailInput.value = "";
      messageInput.value = "";

    } catch (error) {
      showStatus("Error saving submission", true);
      console.error("Error:", error);
    } finally {
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      submitBtn.style.opacity = "1";
    }
  });

  // Add Enter key support
  [nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitBtn.click();
      }
    });
  });
});