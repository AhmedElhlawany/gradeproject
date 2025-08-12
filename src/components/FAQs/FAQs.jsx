import React, { useEffect, useState } from 'react'

export default function FaQs() {


  const faqItems = [
    {
      question: "How do I book a flight?",
      answer:
        "To book a flight, go to the 'Flights' section, enter your departure and destination cities, select your travel dates, and choose a flight from the list. Confirm your details and proceed to payment.",
    },
    {
      question: "Can I cancel my booking?",
      answer:
        "Yes, you can cancel your booking from the 'Saved Trips' section. Cancellations are subject to the airline's policy, and refunds may take 5-7 business days to process.",
    },
    {
      question: "Is my payment secure?",
      answer:
        "Yes, we use industry-standard encryption to protect your payment information. We do not store your credit card details on our servers.",
    },
    {
      question: "What if my flight is delayed or canceled?",
      answer:
        "If your flight is delayed or canceled, you will receive a notification. You can check the updated status in the app or contact the airline directly.",
    },
    {
      question: "Can I modify my booking after payment?",
      answer:
        "Some bookings allow modifications for a fee. Check the terms of your ticket in the 'Booking Details' section. If allowed, you can change dates or passenger details through the app.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can contact our support team through the 'Contact Us' page, available 24/7 via email or phone. We aim to respond within 24 hours.",
    },
    {
      question: "Do you offer discounts for frequent travelers?",
      answer:
        "Yes! Join our loyalty program in the app to earn points on every booking. Points can be redeemed for discounts on future flights and hotels.",
    },
    {
      question: "Is my personal data safe with you?",
      answer:
        "Absolutely. We comply with data protection regulations and never share your personal information with third parties without your consent.",
    },
  ];

  return (
    <div style={{ backgroundColor: "#F9FAFB", minHeight: "100vh" , paddingTop: "70px" }}>
     

      <div className="container py-4">
        <h3 className="mb-4 fw-bold" style={{ color: "#77BEF0" }}>Frequently Asked Questions</h3>

        <div className="accordion" id="faqAccordion">
          {faqItems.map((item, index) => {
            const headingId = `heading${index}`;
            const collapseId = `collapse${index}`;
            return (
              <div className="accordion-item mb-2 border rounded" key={index}>
                <h2 className="accordion-header" id={headingId}>
                  <button
                    className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${collapseId}`}
                    aria-expanded={index === 0 ? "true" : "false"}
                    aria-controls={collapseId}
                    style={{ fontWeight: "600", color: "#1c1c1c" }}
                  >
                    {item.question}
                  </button>
                </h2>
                <div
                  id={collapseId}
                  className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                  aria-labelledby={headingId}
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body" style={{ color: "#57564F", fontSize: "14px", lineHeight: "1.6" }}>
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
