import React from 'react';
import { Link } from 'react-router-dom';

function WelcomePage() {
    return (
        <div>
            <h1>Welcome to the Game!</h1>
            <Link to="/calibration">
                <button>Continue</button>
            </Link>
        </div>
    );
}

export default WelcomePage;
