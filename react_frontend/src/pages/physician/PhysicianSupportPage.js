import React from "react";
import { Link } from "react-router-dom";
import titleImage from "../../assets/title.svg";
import patientsIcon from "../../assets/my-patients.svg";
import supportIcon from "../../assets/support-light.svg";
import profileIcon from "../../assets/profile-light.svg";
import termsAndConditions from "../../assets/TermsAndConditions.pdf";
import "./PhysicianSupportPage.css";

const PhysicianSupportPage = () => {
  return (
    <div className="physician-home-container">
      <div className="left-side-physician">
        <div className="title-container">
          <img src={titleImage} alt="Title" className="title-image" />
        </div>
        <div className="menu">
          <Link to="/physician-home-page" className="menu-item link">
            <img src={patientsIcon} alt="My Patients" />
            <span>My Patients</span>
          </Link>
          <Link to="/physician-support" className="menu-item link colored">
            <img src={supportIcon} alt="Support" />
            <span>Support</span>
          </Link>
        </div>
        <Link to="/physician-login" className="menu-item link logout">
          <img src={profileIcon} alt="Log Out" />
          <span>Log Out</span>
        </Link>
      </div>

      <div className="right-side-physician">
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
              <a
                href="mailto:physiciansupport@cognify.ca"
                className="underline"
              >
                physiciansupport@cognify.ca
              </a>
            </li>
            <li>
              <strong>Live Chat:</strong> Access live chat support from 9 am - 9
              pm EST at 1-(800)-COGNIFY
            </li>
          </ul>
          <h2 className="subheading-support disclaimer-subheading">
            Disclaimer
          </h2>
          <p className="disclaimer-text">
            While every effort has been made to ensure the accuracy of the
            results, the platform’s data should be considered as one part of a
            comprehensive clinical evaluation. The results and metrics presented
            are meant to support clinical evaluations but should not be used as
            standalone diagnostic tools. Physicians are responsible for
            interpreting the data in conjunction with their clinical judgment
            and the patient’s overall context. By using this platform, you agree
            to adhere to all applicable professional and ethical standards. For
            additional support, please refer to our{" "}
            <a
              href={termsAndConditions}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Terms & Conditions
            </a>
          </p>
          <div style={{ height: "50px" }}></div>{" "}
          {/* Spacer to allow scrolling */}
        </div>
      </div>
    </div>
  );
};

export default PhysicianSupportPage;
