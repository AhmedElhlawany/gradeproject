import React from 'react';
import styles from './StepsBar.module.css';

const StepsBar = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Select Rooms' },
    { id: 2, name: 'Enter Details' },
    { id: 3, name: 'Payment' },
  ];

  return (
    <div className={`container my-4 ${styles.stepsContainer}`}>
      <div className="d-flex justify-content-between align-items-center">
        {steps.map((step, index) => (
          <div key={step.id} className={`text-center ${styles.step}`}>
            <div
              className={`rounded-circle mx-auto d-flex align-items-center justify-content-center ${
                styles.stepCircle
              } ${currentStep >= step.id ? styles.active : ''} ${currentStep == step.id ? styles.now : ''} `}
            >
              {step.id}
            </div>
            <span className={`mt-2 d-block ${currentStep >= step.id ? styles.activeText : 'text-muted'}`}>
              {step.name}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`flex-grow-1 ${styles.connector} ${
                  currentStep > step.id ? styles.activeConnector : ''
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepsBar;