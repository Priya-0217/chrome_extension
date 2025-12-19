/**
 * Chrome Extension Form Submission Handler
 * 
 * This module handles form submission from the popup interface, including:
 * - Form validation and user input processing
 * - Data storage using Chrome Storage API
 * - Animation and user feedback
 * - Dashboard redirection upon successful submission
 * 
 * @module FormSubmission
 * @author Priya
 * @version 1.0.0
 * @requires DOMContentLoaded event
 */

/**
 * Main entry point - Initializes when DOM is fully loaded
 * Sets up form elements, validation, and event handlers
 */
document.addEventListener("DOMContentLoaded", () => {
  // DOM Element References
  const nameInput = document.getElementById("name");      // Name input field
  const emailInput = document.getElementById("email");    // Email input field
  const messageInput = document.getElementById("message"); // Message textarea
  const submitBtn = document.getElementById("submitBtn");  // Submit button
  const statusEl = document.getElementById("status");      // Status message display

  /**
   * Injects CSS animations for status messages
   * Creates and appends a style element with fade-in animation
   * Uses Content Security Policy (CSP) safe injection method
   */
  const injectAnimations = () => {
    const style = document.createElement('style');
    style.textContent = `
      /* Fade-in animation for status messages */
      @keyframes fadeIn {
        from { 
          opacity: 0; 
          transform: translateY(-5px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
      
      /* Success animation class */
      .success-animation {
        animation: fadeIn 0.3s ease-out;
      }
    `;
    document.head.appendChild(style);
  };

  // Inject animation styles on initialization
  injectAnimations();

  /**
   * Displays status messages to the user
   * 
   * @param {string} text - The message text to display
   * @param {boolean} [isError=false] - Whether this is an error message
   * @returns {void}
   * 
   * @example
   * showStatus("Submission successful!"); // Success message
   * showStatus("Email is invalid", true); // Error message
   */
  function showStatus(text, isError = false) {
    // Set message text
    statusEl.textContent = text;
    
    // Make element visible
    statusEl.style.display = "block";
    
    // Set color based on message type
    statusEl.style.color = isError ? "#dc2626" : "#059467";
    
    // Add animation class
    statusEl.classList.add('success-animation');
    
    // Auto-hide success messages after 1.5 seconds
    if (!isError) {
      setTimeout(() => {
        statusEl.textContent = "";
        statusEl.style.display = "none";
        statusEl.classList.remove('success-animation');
      }, 1500);
    }
  }

  /**
   * Validates form input fields
   * 
   * @param {string} name - User's name
   * @param {string} email - User's email address
   * @param {string} message - User's message
   * @returns {boolean} True if validation passes, false otherwise
   * 
   * Validation Rules:
   * 1. All fields must be non-empty
   * 2. Email must match standard email format
   */
  function validate(name, email, message) {
    // Check for empty fields
    if (!name || !email || !message) {
      showStatus("Please fill in all fields", true);
      return false;
    }

    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus("Invalid email address", true);
      return false;
    }

    return true;
  }

  /**
   * Submit button click event handler
   * 
   * Processes form submission with the following steps:
   * 1. Validates user input
   * 2. Shows loading state
   * 3. Saves data to Chrome storage
   * 4. Provides user feedback
   * 5. Redirects to dashboard on success
   * 
   * @async
   * @param {Event} e - The click event object
   * @returns {Promise<void>}
   * 
   * @throws Will show error message if storage operation fails
   */
  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // Get and trim input values
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    // Validate inputs - stop if validation fails
    if (!validate(name, email, message)) return;

    // Disable button and show loading state
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Submitting...";
    submitBtn.style.opacity = "0.7";

    try {
      // Step 1: Retrieve existing submissions from Chrome storage
      const result = await new Promise(resolve => {
        chrome.storage.local.get(["submissions"], resolve);
      });
      
      // Initialize submissions array if it doesn't exist
      const submissions = result.submissions || [];

      // Step 2: Create new submission object
      const newSubmission = {
        id: Date.now() + '-' + Math.random().toString(36).substr(2, 9), // Unique ID
        name,           // User's name
        email,          // User's email
        message,        // User's message
        timestamp: new Date().toISOString() // ISO timestamp for sorting
      };

      // Add new submission to array
      submissions.push(newSubmission);

      // Step 3: Save updated submissions to Chrome storage
      await new Promise(resolve => {
        chrome.storage.local.set({ submissions }, resolve);
      });

      // Step 4: Show success message
      showStatus("✓ Success! Opening dashboard...");

      // Step 5: Open dashboard after short delay for better UX
      setTimeout(() => {
        chrome.tabs.create({
          url: chrome.runtime.getURL("options.html"), // Dashboard page
          active: true // Make tab active
        });
      }, 500); // 500ms delay for user to read success message

      // Step 6: Reset form fields
      nameInput.value = "";
      emailInput.value = "";
      messageInput.value = "";

    } catch (error) {
      // Handle any errors during submission process
      showStatus("Error saving submission", true);
      console.error("Form submission error:", error);
    } finally {
      // Always re-enable button regardless of success/failure
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      submitBtn.style.opacity = "1";
    }
  });

  /**
   * Adds Enter key support for form submission
   * Allows users to submit form by pressing Enter in any input field
   * 
   * Listens for 'keypress' events on all form inputs
   * Triggers submit button click when Enter key is pressed
   */
  const addEnterKeySupport = () => {
    [nameInput, emailInput, messageInput].forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // Prevent default form submission
          submitBtn.click();  // Trigger submit button click
        }
      });
    });
  };

  // Initialize Enter key support
  addEnterKeySupport();

 
});

/**
 * Data Flow Summary:
 * 
 * 1. User fills form → Clicks Submit/Enter
 * 2. validate() checks inputs → Shows errors if invalid
 * 3. Button shows loading state
 * 4. Submissions retrieved from chrome.storage.local
 * 5. New submission added to array
 * 6. Updated array saved back to storage
 * 7. Success message shown → Form cleared
 * 8. Dashboard opens in new tab after delay
 * 9. Button returns to normal state
 * 
 * Error Handling:
 * - Validation errors shown immediately
 * - Storage errors caught and shown to user
 * - Button always re-enabled in finally block
 */
