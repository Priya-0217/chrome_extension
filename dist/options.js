 /**
 * Chrome Extension Dashboard Main Controller
 * 
 * This module handles the dashboard interface for managing form submissions.
 * It provides a gradient-themed UI with CRUD operations and modal dialogs.
 * 
 * @file popup.js (Dashboard Section)
 * @module DashboardController
 * @author Priya
 * @version 1.0.0
 * @requires DOMContentLoaded event, Chrome Storage API
 */

/**
 * Main dashboard initialization function
 * Runs when the DOM is fully loaded to ensure all elements are available
 */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("options-root");

  if (!root) {
    console.error("options-root not found");
    return;
  }

   /**
   * CSS Injection Function
   * Injects all dashboard styles dynamically (CSP-safe method for Chrome extensions)
   */
  const style = document.createElement("style");
  style.textContent = `
    /* Clean background for the entire dashboard */
    body {
      margin: 0;
      padding: 30px;
      min-height: 100vh;
      background: #ACE1AF;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    }

    /* Clean white card with subtle shadow */
    .card {
      background: #ffffff;
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Gradient text for the main heading */
    h1 {
      background: linear-gradient(90deg, #065f46 0%, #059467 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;
      font-size: 32px;
      font-weight: 700;
    }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 20px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e5e7eb;
    }

    .subtitle {
      color: #475569;
      margin: 0;
      font-size: 16px;
    }

    .selected-count {
      margin-left: 10px;
      color: #059467;
      font-weight: bold;
    }

    .actions {
      display: flex;
      gap: 12px;
    }

    /* Gradient buttons */
    .btn {
      padding: 10px 20px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      z-index: 1;
    }

    .btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: -1;
    }

    .btn:hover::before {
      opacity: 1;
    }

    .btn-delete-all {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      color: white;
    }

    .btn-delete-all::before {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    }

    .btn-select-all {
      background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
      color: white;
    }

    .btn-select-all::before {
      background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    }

    .btn-delete {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      color: #dc2626;
      border: 1px solid #fca5a5;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-weight: 600;
    }

    .btn-delete:hover {
      background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
    }

    /* Gradient table header */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    th {
      background: linear-gradient(135deg, #059467 0%, #10b981 100%);
      color: white;
      text-align: left;
      padding: 16px;
      font-weight: 600;
      white-space: nowrap;
      border: none;
    }

    th:first-child {
      border-top-left-radius: 12px;
    }

    th:last-child {
      border-top-right-radius: 12px;
    }

    td {
      padding: 16px;
      border-bottom: 1px solid #e5e7eb;
      color: #334155;
      white-space: nowrap;
      background: white;
      transition: all 0.3s ease;
    }

    tr.selected td {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    }

    tr:hover td {
      background: #f8fafc;
      transform: translateX(4px);
    }

    .empty {
      text-align: center;
      padding: 60px 40px;
      color: #64748b;
      font-size: 18px;
      background: #f8fafc;
      border-radius: 12px;
      margin: 20px 0;
    }

    .table-wrapper {
      overflow-x: auto;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      background: white;
    }

    .checkbox {
      width: 20px;
      height: 20px;
      cursor: pointer;
      accent-color: #059467;
    }

    .message-cell {
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Clean Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(3px);
    }

    .modal-content {
      background: white;
      padding: 40px;
      border-radius: 16px;
      max-width: 450px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    }

    .modal-title {
      margin-top: 0;
      margin-bottom: 20px;
      color: #1f2937;
      font-size: 24px;
    }

    .modal-text {
      margin-bottom: 15px;
      color: #4b5563;
      line-height: 1.6;
    }

    .warning-text {
      color: #dc2626;
      font-weight: 700;
      font-size: 16px;
      margin-bottom: 30px;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
    }

    .btn-cancel {
      background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
      color: white;
    }

    .btn-cancel:hover {
      background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
    }

    .btn-confirm-delete {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      color: white;
    }

    .btn-confirm-delete:hover {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    }

    /* Gradient effects for table rows */
    tr:last-child td:first-child {
      border-bottom-left-radius: 12px;
    }

    tr:last-child td:last-child {
      border-bottom-right-radius: 12px;
    }

    /* Number badges with gradient */
    td:first-child {
      font-weight: 600;
      color: #059467;
    }

    /* Scrollbar styling */
    .table-wrapper::-webkit-scrollbar {
      height: 8px;
    }

    .table-wrapper::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }

    .table-wrapper::-webkit-scrollbar-thumb {
      background: linear-gradient(90deg, #059467 0%, #10b981 100%);
      border-radius: 4px;
    }

    .table-wrapper::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(90deg, #047857 0%, #059467 100%);
    }

    /* Responsive design */
    @media (max-width: 768px) {
      body {
        padding: 15px;
      }
      
      .card {
        padding: 20px;
      }
      
      h1 {
        font-size: 24px;
      }
      
      .header-row {
        flex-direction: column;
        align-items: stretch;
      }
      
      .actions {
        justify-content: center;
      }
    }
  `;
  document.head.appendChild(style);

/**
   * Application State Variables
   * These track the current state of the dashboard
   */

  let submissions = [];  // Array of all form submission objects
  let selectedIndexes = [];  // Array of indices currently selected by user


  /**
   * Load Submissions from Chrome Storage
   * Retrieves saved submissions from chrome.storage.local API
   * Calls renderDashboard() after data is loaded
   */

  function loadSubmissions() {
    chrome.storage.local.get(["submissions"], (res) => {
      submissions = res.submissions || [];
      console.log("Loaded submissions:", submissions);
      renderDashboard();
    });
  }
 /**
   * Delete a Single Submission
   * Removes one submission by index and updates storage
   * 
   * @param {number} index - The array index of the submission to delete
   */
  function deleteSubmission(index) {
    console.log("Deleting index:", index);
    
    const updatedSubmissions = submissions.filter((_, i) => i !== index);
    
    chrome.storage.local.set({ submissions: updatedSubmissions }, () => {
      submissions = updatedSubmissions;
      // Remove the deleted index from selectedIndexes
      selectedIndexes = selectedIndexes.filter(idx => idx !== index);
      // Adjust other indexes that were after the deleted one
      selectedIndexes = selectedIndexes.map(idx => idx > index ? idx - 1 : idx);
      renderDashboard();
    });
  }
 /**
   * Delete Multiple Selected Submissions
   * Batch deletion of all currently selected submissions
   */
  function deleteSelectedSubmissions() {
    console.log("Deleting selected indexes:", selectedIndexes);
    if (selectedIndexes.length === 0) return;
    
    // Sort in descending order so we delete from the end first
    const indexesToDelete = [...selectedIndexes].sort((a, b) => b - a);
    
    let updatedSubmissions = [...submissions];
    
    // Delete indexes from highest to lowest
    indexesToDelete.forEach(index => {
      updatedSubmissions.splice(index, 1);
    });
    
    chrome.storage.local.set({ submissions: updatedSubmissions }, () => {
      submissions = updatedSubmissions;
      selectedIndexes = [];
      renderDashboard();
    });
  }
  /**
   * Toggle Selection State for a Submission
   * Adds or removes a submission from the selection array
   * 
   * @param {number} index - The index of the submission to toggle
   */

  function toggleSelectItem(index) {
    console.log("Toggling index:", index);
    if (selectedIndexes.includes(index)) {
      selectedIndexes = selectedIndexes.filter(idx => idx !== index);
    } else {
      selectedIndexes.push(index);
    }
    renderDashboard();
  }

  function selectAllItems() {
    if (selectedIndexes.length === submissions.length) {
      selectedIndexes = [];
    } else {
      selectedIndexes = submissions.map((_, index) => index);
    }
    renderDashboard();
  }

   /**
   * Show Confirmation Modal for Deletion
   * Displays a modal dialog to confirm deletion action
   * 
   * @param {number|null} index - Index for single deletion, null for bulk deletion
   */

  function showDeleteModal(index = null) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <h3 class="modal-title">
          ${index !== null ? 'Delete Submission' : 'Delete Selected Submissions'}
        </h3>
        <p class="modal-text">
          ${index !== null 
            ? 'Are you sure you want to delete this submission?' 
            : `Are you sure you want to delete ${selectedIndexes.length} selected submission(s)?`}
        </p>
        <p class="warning-text">⚠️ This action cannot be undone.</p>
        <div class="modal-actions">
          <button class="btn btn-cancel">Cancel</button>
          <button class="btn btn-confirm-delete">Delete</button>
        </div>
      </div>
    `;

    // Add event listeners
    modal.querySelector('.btn-cancel').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    modal.querySelector('.btn-confirm-delete').addEventListener('click', () => {
      if (index !== null) {
        deleteSubmission(index);
      } else {
        deleteSelectedSubmissions();
      }
      document.body.removeChild(modal);
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });

    document.body.appendChild(modal);
  }

   /**
   * Format Date String for Display
   * Converts ISO date string to human-readable format
   * 
   * @param {string} dateString - ISO format date string
   * @returns {string} Formatted date or "—" if invalid/empty
   */
  function formatDate(dateString) {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return "—";
    }
  }

/**
   * Render Dashboard UI
   * Generates and displays the complete dashboard interface
   * Handles empty state, table rendering, and event listener attachment
   */

  function renderDashboard() {
    root.innerHTML = `
      <div class="card">
        <div class="header-row">
          <div>
            <h1>📊 Extension Dashboard</h1>
            <p class="subtitle">
              Total submissions: <strong>${submissions.length}</strong>
              ${selectedIndexes.length > 0 ? 
                `<span class="selected-count">(${selectedIndexes.length} selected)</span>` : ''}
            </p>
          </div>
          
          ${submissions.length > 0 ? `
            <div class="actions">
              <button class="btn btn-select-all" id="selectAllBtn">
                ${selectedIndexes.length === submissions.length ? 'Deselect All' : 'Select All'}
              </button>
              ${selectedIndexes.length > 0 ? `
                <button class="btn btn-delete-all" id="deleteSelectedBtn">
                  Delete Selected (${selectedIndexes.length})
                </button>
              ` : ''}
            </div>
          ` : ''}
        </div>

        ${submissions.length === 0 ? `
          <div class="empty">No submissions yet.</div>
        ` : `
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th class="checkbox-header"></th>
                  <th style="width: 60px;">#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${submissions.map((s, index) => `
                  <tr class="${selectedIndexes.includes(index) ? 'selected' : ''}">
                    <td>
                      <input type="checkbox" class="checkbox" 
                             ${selectedIndexes.includes(index) ? 'checked' : ''}
                             data-index="${index}">
                    </td>
                    <td>${index + 1}</td>
                    <td>${s.name || "—"}</td>
                    <td>${s.email || "—"}</td>
                    <td>
                      <div class="message-cell" title="${s.message || ''}">
                        ${s.message || "—"}
                      </div>
                    </td>
                    <td>${formatDate(s.timestamp)}</td>
                    <td>
                      <button class="btn-delete" data-index="${index}">
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;

    // Add event listeners
    if (submissions.length > 0) {
      // Select all button
      const selectAllBtn = document.getElementById('selectAllBtn');
      if (selectAllBtn) {
        selectAllBtn.addEventListener('click', selectAllItems);
      }

      // Delete selected button (only if it exists)
      const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
      if (deleteSelectedBtn) {
        deleteSelectedBtn.addEventListener('click', () => showDeleteModal());
      }

      // Individual checkboxes
      document.querySelectorAll('.checkbox[data-index]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
          const index = parseInt(e.target.getAttribute('data-index'));
          toggleSelectItem(index);
        });
      });

      // Delete buttons
      document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', (e) => {
          const index = parseInt(e.target.getAttribute('data-index'));
          showDeleteModal(index);
        });
      });
    }
  }

  // Initial load
  loadSubmissions();
});
