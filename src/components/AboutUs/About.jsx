import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaUsers, FaRocket, FaLeaf } from "react-icons/fa";
import styles from "./About.module.css";

export default function About() {
  const navigate = useNavigate();

  const handleBackToFlights = () => {
    navigate("/flights");
  };

  const timelineEvents = [
    { year: "2018", event: "Fly High was founded with a vision to simplify travel." },
    { year: "2020", event: "Launched our mobile app for seamless booking." },
    { year: "2022", event: "Partnered with over 100 airlines worldwide." },
    { year: "2025", event: "Introduced eco-friendly travel options." },
  ];


  return (
    <div className="container-fluid p-0">
      <div className={styles.header}>
        <div className={styles.overlay}>
          <h1 className={styles.headerTitle}>About Fly High</h1>
          <p className={styles.headerText}>
            Your trusted partner in seamless and affordable flight bookings.
          </p>
        </div>
      </div>

      <div className="container my-5" style={{ paddingTop: "70px" }}>
        <div className={styles.section}>
          <div className="row align-items-center">
            <div className="col-12">
              <h2 className={styles.sectionTitle}>Who We Are</h2>
              <p className={styles.textLarge}>
                Fly High is a leading flight booking platform dedicated to making
                air travel accessible, affordable, and hassle-free. Founded with a
                passion for connecting people and places, we partner with a vast
                network of airlines to offer competitive prices and personalized
                travel options. Our goal is to empower every traveler to explore
                the world with confidence and ease.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className="row">
            <div className="col-12 col-md-6 mb-4">
              <div className={styles.card}>
                <h3 className={styles.subTitle}>Our Mission</h3>
                <p className={styles.text}>
                  To simplify the flight booking process by providing an intuitive
                  platform with transparent pricing, real-time updates, and
                  exceptional customer support, ensuring stress-free journeys for
                  all travelers.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className={styles.card}>
                <h3 className={styles.subTitle}>Our Vision</h3>
                <p className={styles.text}>
                  To redefine air travel by creating a world where booking a flight
                  is effortless. We aim to be the leading global platform for
                  flight reservations, integrating innovative technology to deliver
                  unforgettable travel experiences.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.subTitle}>Our Values</h3>
          <div className="row">
            <div className="col-12 col-md-6 mb-4">
              <div className={styles.valueItem}>
                <FaCheckCircle className={styles.valueIcon} />
                <div>
                  <h4>Transparency</h4>
                  <p>Clear pricing and honest communication with no hidden fees.</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className={styles.valueItem}>
                <FaUsers className={styles.valueIcon} />
                <div>
                  <h4>Customer Satisfaction</h4>
                  <p>24/7 support to ensure a seamless travel experience.</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className={styles.valueItem}>
                <FaRocket className={styles.valueIcon} />
                <div>
                  <h4>Innovation</h4>
                  <p>Leveraging cutting-edge technology for better booking.</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className={styles.valueItem}>
                <FaLeaf className={styles.valueIcon} />
                <div>
                  <h4>Sustainability</h4>
                  <p>Promoting eco-friendly travel and sustainable practices.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.subTitle}>Why Choose Us</h3>
          <div className={`row ${styles.featureRow}`}>
            {[
              { icon: FaCheckCircle, text: "Competitive prices with no hidden fees" },
              { icon: FaUsers, text: "Real-time flight tracking and updates" },
              { icon: FaRocket, text: "Customizable travel options" },
              { icon: FaLeaf, text: "24/7 customer support" },
            ].map((item, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-3 mb-4">
                <div className={styles.featureCard}>
                  <item.icon className={styles.featureIcon} />
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.subTitle}>Our Journey</h3>
          <div className={styles.timeline}>
            {timelineEvents.map((event, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.timelineContent}>
                  <h4>{event.year}</h4>
                  <p>{event.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-center mt-5">
          <button className={styles.backBtn} onClick={handleBackToFlights}>
            Back to Flights
          </button>
        </div>
      </div>
    </div>
  );
}