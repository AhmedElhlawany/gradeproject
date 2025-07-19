import React from "react";
import styles from "./Terms.module.css";

export default function PrivacyAndTerms() {
  return (
    <div className="container my-5" style={{ paddingTop: "70px" }}>
      <h2 className={styles.sectionTitle}>Privacy Policy & Terms of Service</h2>

      <div className={styles.contentCard}>
        <h3 className={styles.subTitle}>Privacy Policy</h3>
        <p className={styles.text}>
          At TravelEasy, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our flight booking application.
        </p>
        <h4 className={styles.subHeading}>Information We Collect</h4>
        <p className={styles.text}>
          We collect information you provide directly, such as your name, email address, and payment details when you book a flight. We also collect usage data, such as your browsing activity and preferences, to improve our services.
        </p>
        <h4 className={styles.subHeading}>How We Use Your Information</h4>
        <p className={styles.text}>
          Your information is used to process bookings, personalize your experience, and send you relevant offers. We do not share your personal data with third parties except as necessary to complete your booking or comply with legal requirements.
        </p>
        <h4 className={styles.subHeading}>Data Security</h4>
        <p className={styles.text}>
          We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h3 className={styles.subTitle}>Terms of Service</h3>
        <p className={styles.text}>
          By using TravelEasy, you agree to these Terms of Service. These terms govern your use of our flight booking application and services.
        </p>
        <h4 className={styles.subHeading}>Booking and Payments</h4>
        <p className={styles.text}>
          All bookings are subject to availability and airline policies. Payments must be made in full at the time of booking. Refunds and cancellations are subject to the airline's terms and conditions.
        </p>
        <h4 className={styles.subHeading}>User Responsibilities</h4>
        <p className={styles.text}>
          You agree to provide accurate information when booking flights. You are responsible for complying with all applicable laws and regulations related to travel.
        </p>
        <h4 className={styles.subHeading}>Limitation of Liability</h4>
        <p className={styles.text}>
          TravelEasy is not liable for any delays, cancellations, or disruptions caused by airlines or other third parties. We are not responsible for any loss or damage resulting from your use of our services.
        </p>

        <div className="d-flex justify-content-center mt-4">
          <a href="/contact" className={styles.contactBtn}>
            Contact Us for More Information
          </a>
        </div>
      </div>
    </div>
  );
}