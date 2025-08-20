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
        onSuccess(); // notify parent
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Enter Master Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="w-full border p-2 rounded mb-3"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Master password"
          />
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-400 text-white rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
