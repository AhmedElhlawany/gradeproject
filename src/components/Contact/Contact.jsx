import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Contact.module.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleBack = () => {
    setIsSubmitted(false);
    setFormData({ name: "", email: "", message: "" });
  };

  const handleBackToFlights = () => {
    navigate("/flights");
  };

  return (
    <div className="container my-5" style={{ paddingTop: "70px" }}>
      <h2 className={styles.sectionTitle}>Contact Us</h2>

      <div className={styles.contactCard}>
        {isSubmitted ? (
          <div className={styles.confirmation}>
            <h3 className={styles.subTitle}>Message Sent Successfully!</h3>
            <p className={styles.text}>
              Thank you for reaching out. We'll get back to you soon.
            </p>
            <div className="d-flex justify-content-center mt-4 gap-3">
              <button className={styles.submitBtn} onClick={handleBack}>
                Send Another Message
              </button>
              <button className={styles.submitBtn} onClick={handleBackToFlights}>
                Back to Flights
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className={styles.subTitle}>Get in Touch</h3>
            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your Message"
                  className={styles.textarea}
                  rows="5"
                  required
                />
              </div>
              <div className="d-flex justify-content-center mt-4">
                <button type="submit" className={styles.submitBtn}>
                  Submit
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}