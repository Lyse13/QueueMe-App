import React from "react";
import { useParams } from "react-router-dom";

const serviceDetails = {
  registration: "Complete your academic registration process.",
  id_card: "Request or reprint your student ID card.",
  library: "Access your library borrowing and return services.",
  exam_pass: "Generate and print your exam pass.",
  update_receipt: "Upload or validate your payment receipts.",
  pay_bills: "View and pay outstanding bills and fees.",
  transcript: "Request your academic transcript.",
  hostel: "Apply for hostel accommodation.",
  course_reg: "Register for your semester courses.",
  support: "Reach out to student support services.",
  medical: "Book medical appointments or upload records.",
  sports: "Clear your sports and recreational obligations.",
};

export default function ServiceDetail() {
  const { serviceId } = useParams();

  const label = serviceId?.replace("_", " ").toUpperCase();
  const description = serviceDetails[serviceId] || "No information available.";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)",
      color: "#fff",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: 40
    }}>
      <div style={{
        maxWidth: 600,
        margin: "0 auto",
        background: "rgba(255,255,255,0.06)",
        borderRadius: 20,
        padding: 30,
        border: "1px solid rgba(255,255,255,0.15)",
        backdropFilter: "blur(20px)",
      }}>
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>{label}</h2>
        <p style={{ fontSize: 18 }}>{description}</p>
        <p style={{ marginTop: 30, fontStyle: "italic", opacity: 0.8 }}>More interactive features coming soon for this service.</p>
      </div>
    </div>
  );
}

