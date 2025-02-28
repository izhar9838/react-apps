import React from 'react';
import FooterSection from './FooterSection';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer bottom-0 w-100% bg-gradient-to-r from-green-50 via-emerald-50 to-green-50">
      <div className="footer-container">
        <FooterSection 
          title="About Us" 
          content="We are a top-tier school, providing quality education to students across the globe." 
        />
        <FooterSection 
          title="Contact" 
          content={[
            "123 School St., Education City",
            "Email: contact@school.com",
            "Phone: (123) 456-7890"
          ]}
        />
        <FooterSection 
          title="Quick Links" 
          content={[
            "Home",
            "About",
            "Courses",
            "Admissions",
            "Contact"
          ]}
        />
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 School Name. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
