import React, { useEffect, useState } from "react";

export default function Options() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    chrome.storage.local.get(["submissions"], (res) => {
      setSubmissions(res.submissions || []);
    });
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>📊 Extension Dashboard</h1>

        <p style={styles.subtitle}>
          Total submissions: <strong>{submissions.length}</strong>
        </p>

        {submissions.length === 0 ? (
          <p style={styles.empty}>No submissions yet.</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Message</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s.id}>
                    <td style={styles.td}>{s.name}</td>
                    <td style={styles.td}>{s.email}</td>
                    <td style={styles.td}>{s.message || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================== STYLES ================== */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0fdf4, #ecfeff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 30,
    fontFamily: "Segoe UI, sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: 900,
    background: "#ffffff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  title: {
    marginBottom: 8,
    color: "#065f46",
  },

  subtitle: {
    marginBottom: 20,
    color: "#475569",
  },

  empty: {
    textAlign: "center",
    padding: 30,
    color: "#64748b",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    backgroundColor: "#059467",
    color: "#ffffff",
    textAlign: "left",
    padding: 12,
    fontWeight: 600,
  },

  td: {
    padding: 12,
    borderBottom: "1px solid #e5e7eb",
    color: "#334155",
  },
};
