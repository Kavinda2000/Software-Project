import React, { useState } from 'react';
import './Support.css';

function CustomerFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { question: 'How do I reset my password?', answer: 'Click on "Forgot password?" on the login page and follow the instructions.' },
    { question: 'How can I track my order?', answer: 'Go to your Orders page in the dashboard to view the status of your order in real-time.' },
    { question: 'How do I update my profile?', answer: 'Go to Account Settings from the dashboard to update your details.' },
    { question: 'Can I cancel my order?', answer: 'Yes, you can cancel within 24 hours of placing your order via the Orders page.' },
    { question: 'What payment methods are accepted?', answer: 'We accept all major credit/debit cards and PayPal.' },
    { question: 'Do you provide product warranties?', answer: 'Yes, warranty info is shown on the product page.' },
    { question: 'How can I contact support?', answer: 'Use the Support page to submit a request and our team will assist you.' },
    { question: 'What are your support hours?', answer: 'Monday to Friday, 9 AM – 6 PM (local time).' },
    { question: 'Do you have a loyalty program?', answer: 'Yes, check your dashboard for rewards and perks.' },
    { question: 'Can I give feedback?', answer: 'Submit your suggestions via the Support page.' }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="support-container">
      <h1>Frequently Asked Questions</h1>
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              {faq.question} <span className="faq-toggle">{openIndex === index ? '−' : '+'}</span>
            </div>
            <div className="faq-answer">
              {openIndex === index && <p>{faq.answer}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerFAQ;
