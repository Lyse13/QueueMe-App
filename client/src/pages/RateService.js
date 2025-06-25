// RateService.js
import React, { useState } from "react";

export default function RateService() {
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating) {
      // Here you would send the feedback to the backend
      setSubmitted(true);
    }
  };

  return (
    <div style={{ color: "#fff", maxWidth: 400, margin: "0 auto" }}>
      <h3>Rate Our Service</h3>
      {submitted ? (
        <p>Thank you for your feedback!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <p>Please rate your experience:</p>
          <div style={{ marginBottom: 12 }}>
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                type="button"
                key={num}
                onClick={() => setRating(num)}
                style={{
                  margin: 4,
                  background: rating === num ? "#60a5fa" : "#1e293b",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "6px 12px",
                  fontWeight: rating === num ? 700 : 400,
                  fontSize: 18,
                  cursor: "pointer",
                }}
                aria-label={`Rate ${num}`}
              >
                {num} ★
              </button>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Additional comments (optional)"
              rows={3}
              style={{
                width: "100%",
                borderRadius: 6,
                border: "1px solid #334155",
                padding: 8,
                fontSize: 15,
                background: "#1e293b",
                color: "#fff",
                resize: "vertical",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!rating}
            style={{
              width: "100%",
              marginTop: 8,
              background: rating ? "#10b981" : "#334155",
              color: "#fff",
              padding: "10px 0",
              borderRadius: 6,
              border: "none",
              fontWeight: 600,
              fontSize: 16,
              cursor: rating ? "pointer" : "not-allowed",
              transition: "background 0.2s",
            }}
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
