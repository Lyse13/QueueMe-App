import React, { useState } from "react";

const faqs = [
  { q: "How do I join a queue?", a: "Go to 'Available Services' and click 'Join Queue' for your desired service." },
  { q: "How do I update my profile?", a: "Navigate to 'Profile Management' and edit your details." },
  { q: "How do I get notifications?", a: "Enable email or SMS alerts in 'Settings'." },
  { q: "How do I reset my password?", a: "Click 'Forgot Password' on the login page and follow the instructions sent to your email." },
  { q: "Can I cancel my queue ticket?", a: "Yes, go to 'My Queue' and click the cancel button next to your ticket." },
  { q: "How do I rate a service?", a: "After your service is completed, go to 'Rate a Service' and submit your feedback." },
  { q: "What if I miss my turn in the queue?", a: "You will receive a notification and may need to rejoin the queue for that service." },
  { q: "How do I view my service history?", a: "Go to 'My History' to see all your past services and tickets." },
  { q: "How do I enable or disable SMS alerts?", a: "Go to 'Settings' and toggle the SMS Alerts option." },
  { q: "Can I change the language of the app?", a: "Yes, select your preferred language in 'Settings'." },
  { q: "How do I contact support?", a: "Use the contact information at the bottom of this page or email support@queue-me.com." },
  { q: "Is my personal data secure?", a: "Yes, we use industry-standard security practices to protect your data." },
  { q: "Can I use the app on my phone?", a: "Yes, the app is mobile-friendly and works on all modern browsers." }
];

export default function Help() {
  const [open, setOpen] = useState(null);

  return (
    <div style={{ color: "#fff", maxWidth: 600, margin: "0 auto" }}>
      <h3>Help / Support</h3>
      <h4 style={{ color: "#60a5fa" }}>Frequently Asked Questions</h4>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {faqs.map((faq, idx) => (
          <li key={idx} style={{ marginBottom: 16 }}>
            <button
              onClick={() => setOpen(open === idx ? null : idx)}
              style={{
                background: "#1e293b",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "10px 16px",
                width: "100%",
                textAlign: "left",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {faq.q}
            </button>
            {open === idx && (
              <div style={{ background: "#334155", padding: 12, borderRadius: 6, marginTop: 4 }}>
                {faq.a}
              </div>
            )}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 32 }}>
        <h4 style={{ color: "#60a5fa" }}>Contact Support</h4>
        <p>Email: <a href="mailto:lysettemouandeu@gmail.com" style={{ color: "#3b82f6" }}>lysettemouandeu@gmail.com</a></p>
      </div>
    </div>
  );
}
