import React from 'react';
import { Link } from 'react-router-dom';
import titleImage from '../../assets/title.svg';
import homeIcon from '../../assets/home-light.svg';
import reportIcon from '../../assets/reports-light.svg';
import supportIcon from '../../assets/support-dark.svg';
import profileIcon from '../../assets/profile-light.svg';
import './SupportPage.css';

const SupportPage = () => {
  const getCurrentDateInEST = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const estDate = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York', ...options });
    const date = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York', day: 'numeric' });
    const day = parseInt(date, 10);
    const suffix = getOrdinalSuffix(day);
    return estDate.replace(day, `${day}${suffix}`);
  };

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return (
    <div className="patient-home-container">
      <div className="left-side">
        <div className="title-container">
          <img src={titleImage} alt="Title" className="title-image" />
        </div>
        <div className="menu">
          <Link to="/patient-home-page" className="menu-item link">
            <img src={homeIcon} alt="Home" />
            <span className="home-text">Home</span>
          </Link>
          <Link to="/patient-reporting-landing-page" className="menu-item link">
            <img src={reportIcon} alt="My Reports" />
            <span>My Reports</span>
          </Link>
          <Link to="/support-page" className="menu-item link">
            <img src={supportIcon} alt="Support" />
            <span className="support-text">Support</span>
          </Link>
        </div>
        <Link to="/patient-login" className="menu-item link logout">
          <img src={profileIcon} alt="Log Out" />
          <span>Log Out</span>
        </Link>
      </div>
      <div className="right-side">
        <div className="home-content-support">
          <h1>Support</h1>
          <h2 className="subheading-support">Need Help?</h2>
          <p>
            If you have questions, feedback, or encounter issues, here’s how you can reach us:
          </p>
          <ul>
            <li>
              <strong>Contact Support:</strong> Email us at <span className="underline">patientsupport@cognify.ca</span>
            </li>
            <li>
              <strong>Live Chat:</strong> Access live chat support from 9 am - 9 pm EST at 1-(800)-123-4567
            </li>
          </ul>
          <h2 className="subheading-support disclaimer-subheading">Disclaimer</h2>
          <p className="disclaimer-text">
            Cognify is designed to support physicians in their clinical decision-making process. It provides a platform to collect and present data for evaluation but does not independently diagnose or offer medical advice. All results should be interpreted by qualified healthcare professionals within the context of their clinical expertise and the patient’s specific circumstances. To ensure accurate data collection, the platform should be used in an appropriate and distraction-free environment. We are committed to protecting your information, and all data is managed securely in accordance with our <span className="underline">Privacy Policy</span>. By using this platform, you acknowledge and agree to these terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
