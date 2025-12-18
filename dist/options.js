document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("options-root");

  if (!root) {
    console.error("options-root not found");
    return;
  }

  // Inject table CSS (CSP-safe)
  const style = document.createElement("style");
  style.textContent = `
    .card {
      background: #ffffff;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }

    h1 {
      color: #065f46;
      margin-bottom: 8px;
    }

    .subtitle {
      color: #475569;
      margin-bottom: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      background-color: #059467;
      color: white;
      text-align: left;
      padding: 12px;
    }

    td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
      color: #334155;
    }

    tr:hover td {
      background-color: #f0fdf4;
    }

    .empty {
      text-align: center;
      padding: 40px;
      color: #64748b;
    }

    .table-wrapper {
      overflow-x: auto;
    }
  `;
  document.head.appendChild(style);

  // Load data
  chrome.storage.local.get(["submissions"], (res) => {
    const submissions = res.submissions || [];

    root.innerHTML = `
      <div class="card">
        <h1>📊 Extension Dashboard</h1>
        <p class="subtitle">
          Total submissions: <strong>${submissions.length}</strong>
        </p>

        ${
          submissions.length === 0
            ? `<div class="empty">No submissions yet.</div>`
            : `
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                ${submissions
                  .map(
                    (s) => `
                  <tr>
                    <td>${s.name || "—"}</td>
                    <td>${s.email || "—"}</td>
                    <td>${s.message || "—"}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;
  });
});
