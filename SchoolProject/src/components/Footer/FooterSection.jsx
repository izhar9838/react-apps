import React from 'react';
import {Navigate} from 'react-router-dom';

const FooterSection = ({ title, content }) => {
  return (
    <div className="footer-section">
      <h3>{title}</h3>
      {Array.isArray(content) ? (
        <ul>
          {content.map((item, index) => (
            <li key={index}>
              {title === "Quick Links" ? (
                <a href='/'>{item}</a>
              ) : (
                item
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>{content}</p>
      )}
    </div>
  );
};

export default FooterSection;
