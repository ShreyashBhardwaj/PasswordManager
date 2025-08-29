import React, { useState } from "react";

export default function PasswordPromptModal({ isOpen, onClose, onSuccess }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://localhost:3001/verify-master-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: input }),
        }
      );

      if (response.ok) {
        onSuccess();
        setInput("");
        onClose();
      } else {
        setError("Incorrect password. Try again.");
      }
    } catch (err) {
      setError("Server error.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="modal-title">🔒 Enter Master Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="modal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Master password"
          />
          {error && <p className="modal-error">{error}</p>}
          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="modal-btn confirm">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
