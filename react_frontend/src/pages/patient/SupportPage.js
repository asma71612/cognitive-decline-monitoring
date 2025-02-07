import React from "react";
import { Link } from "react-router-dom";
import titleImage from "../../assets/title.svg";
import homeIcon from "../../assets/home-light.svg";
import reportIcon from "../../assets/reports-light.svg";
import supportIcon from "../../assets/support-dark.svg";
import profileIcon from "../../assets/profile-light.svg";
import "./SupportPage.css";

const SupportPage = () => {
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
            If you have questions, feedback, or encounter issues, here’s how you
            can reach us:
          </p>
          <ul>
            <li>
              <strong>Contact Support:</strong> Email us at{" "}
              <a href="mailto:patientsupport@cognify.ca" className="underline">
                patientsupport@cognify.ca
              </a>
            </li>
            <li>
              <strong>Live Chat:</strong> Access live chat support from 9 am - 9
              pm EST at 1-(800)-123-4567
            </li>
          </ul>
          <h2 className="subheading-support disclaimer-subheading">
            Disclaimer
          </h2>
          <p className="disclaimer-text">
            Cognify is designed to support physicians in their clinical
            decision-making process. It provides a platform to collect and
            present data for evaluation but does not independently diagnose or
            offer medical advice. All results should be interpreted by qualified
            healthcare professionals within the context of their clinical
            expertise and the patient’s specific circumstances. To ensure
            accurate data collection, the platform should be used in an
            appropriate and distraction-free environment. We are committed to
            protecting your information, and all data is managed securely in
            accordance with our{" "}
            <a
              href={require("../../assets/PrivacyPolicy.pdf")}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              color="black"
            >
              Privacy Policy{""}
            </a>
            . By using this platform, you acknowledge and agree to these terms.
          </p>
          <div style={{ height: "50px" }}></div>{" "}
          {/* Spacer to allow scrolling */}
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
