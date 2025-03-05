# Cognitive Decline Monitoring - Setup Guide

This repository contains the code for the **Cognitive Decline Monitoring** application. It consists of two main parts:
- **Backend**: A Spring Boot application using Python and Flask to handle the logic and API endpoints.
- **Frontend**: A React application using JavaScript for the user interface.

![image](https://github.com/user-attachments/assets/0c9fd956-1fce-4bcb-b822-85517fde41ac)


*Please make sure you are working on a separate branch and not commiting to main - See 'Git Basics' below for instructions**

## Prerequisites

Before you start, ensure you have the following installed on your system:

- **Java 11 or higher**
- **Maven** (for building the backend)
- **Node.js and npm** (for running the frontend)
- **Python 3.11.6** (for running the backend modelling)

## Current Versions
Here are the versions of the tools and technologies currently being used for this project. You do not have to use these version, but just ensure to update your dependencies locally if you choose to deviate.

- **Java**: 21.0.1
- **Maven**: 3.9.9
- **Node.js**: 18.20.5
- **npm**: 10.8.2
- **React**: 18.3.1
- **Spring Boot**: 3.4.0 (already included in pom.xml)
- **Flask** 3.1.0
- **chart.js** 4.4.8
- **react-chartjs-2** 5.3.0
- **@sgratzl/chartjs-chart-boxplot** 4.4.4

These will be included in the package files so if you use a different version, make sure to not commit and push that to the main branch.

## Step 1: Install Java 11 (or higher) and Python

To run the backend, you need to have Java 11 or higher installed. You can download Java from [AdoptOpenJDK](https://adoptopenjdk.net/) or [Oracle's JDK page](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html).

After installation, verify the Java version:
```bash
java --version
```

To run the backend NLP files, you need to install Python which you can do so using brew install or downloading it from the web.

After installation, verify the Python version:
```bash
python --version
```

## Step 2: Install Maven
Windows:
1. Download the latest version of Maven from Apache Maven.
2. Extract the zip file to a directory (e.g., C:\apache-maven).
3. Add the bin directory to the system PATH.
- In the Environment Variables, add a new entry to Path with C:\apache-maven\bin.

Verify installation by running:
```bash
mvn -version
```

MacOS/Linux: You can install Maven using Homebrew (MacOS):
```bash
brew install maven
```

## Step 3: Install Node.js and npm
Windows:
1. Download Node.js from nodejs.org.
2. Install the LTS version (Long-Term Support).

MacOS/Linux: You can install Node.js using Homebrew (MacOS):
```bash
brew install node
```

## Step 4: Clone the Repository
Once the prerequisites are installed, clone the repository to your local machine:
```bash
git clone https://github.com/asma71612/cognitive-decline-monitoring.git
```

Navigate to the project folder:
```bash
cd cognitive-decline-monitoring
```

## Step 5: Setup the Backend
Navigate to the backend folder (demo) in the project:
```bash
cd demo
```

Install the Maven dependencies: If the .mvn wrapper is not available (i.e., mvnw is not working), you can install dependencies using Maven:
```bash
mvn clean install
```

Run the backend: You can run the backend Spring Boot application using Maven:
```bash
mvn spring-boot:run
```

The backend server should now be running at http://localhost:8080. (Note: This port has nothing on it so it will not display anything)

## Step 6: Setup the Frontend
Navigate to the frontend folder (react_frontend):
```bash
cd ../react_frontend
```

Install frontend dependencies: Run the following command to install all the required Node.js packages:
```bash
npm install
```

Install additional dependencies required for the backend to work:
```bash
npm install firebase
npm install react-router-dom
```

Run the frontend: After the installation is complete, you can start the React application:
```bash
npm start
```

The first time you set this up, it may take a few minutes to load and install everything. Usually, the frontend should automatically open and running at http://localhost:3000. You should see a message similar to this in your console:
```bash
Compiled successfully!

You can now view react_frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.2.28:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```

## Step 7: Firebase Setup
The firebase project is located at: https://console.firebase.google.com/u/0/project/capstone-691d0/firestore/databases/-default-/data/~2Fusers~2Ftest

Create a firebaseConfig.js file in `/react_frontend/src/firebaseConfig.js`. Placing it anywhere else will require you to symlink.
```bash
cd react_frontend/src
touch firebaseConfig.js
```

Populate the config file with credentials. It will look something like this:
```js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

// The web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
```

*Replace the placeholder values (YOUR_API_KEY, YOUR_AUTH_DOMAIN, etc.) with your actual Firebase configuration values.**

**Important: Do not commit the firebaseConfig.js file to the repository. Add it to your .gitignore file if it is not already there.**

## Step 8: Flask Setup
If you ran `npm install` it should automatically install important libraries. However, if you get any errors related to Flask, make sure to run the following commands:

```bash
npm install chart.js react-chartjs-2
npm install @sgratzl/chartjs-chart-boxplot
```

If any of the Python imports are giving you trouble, make sure to run the following:
```bash
pip install Flask
pip install flask-cors
pip install spacy
python -m spacy download en_core_web_lg
```

In order to see the box plots populated on the reporting pages for memoryVault, you will need to run the backend Flask server so the frontend is able to hit that endpoint:

```bash
cd demo/flask_api/
python app.py
```

## Stopping the Server
Simply do `Ctrl + C` or `Cmd + C` in the terminal to terminate the batch job

## Running Tests
Navigate to the react_frontend folder and run the following command:
```bash
npm test -- --testPathPattern=src/__tests__/pathToTest/TestName.test.js --watchAll=false
```

Note: The flag ensures that the console exists after running the test and is not on watch mode.

## Troubleshooting
**Issue: Backend or Frontend not starting**

If you face issues with the backend or frontend not starting, ensure that:
1. You have installed all the dependencies using npm install and mvn clean install.
2. There are no port conflicts. Make sure the ports 8080 (for backend) and 3000 (for frontend) are not in use by other applications.

**Issue: Maven or Node.js not found**

If you get errors like command not found, ensure that both Maven and Node.js are correctly installed and added to your system's PATH.

**Issues: Missing Maven Wrapper (mvnw)**

If the Maven wrapper (mvnw) is missing or not working, you may need to regenerate it by running mvn wrapper:wrapper in the backend directory (assuming Maven is already installed).

**Issues: React not loading on the memoryVault All Time Trends Report Page**

This can happen if you have different versions of react and react-dom that are not compatible with the Chartjs version we are using to create the box plots. In that case, cross-reference with the following below:

```bash
npm ls react
```

Yours should look the same as mine, if not, you will need to upgrade/ downgrade versions:
```
├─┬ react-chartjs-2@5.3.0
│ └── react@17.0.2 deduped
├─┬ react-dom@17.0.2
│ └── react@17.0.2 deduped
├─┬ react-router-dom@6.28.1
│ ├─┬ react-router@6.28.1
│ │ └── react@17.0.2 deduped
│ └── react@17.0.2 deduped
├─┬ react-scripts@4.0.3
│ └── react@17.0.2 deduped
└── react@17.0.2
```

## Git Basics
Before you start working:
- Make sure you pull all the latest changes from the main branch:
```bash
git pull origin main
```

Create a new branch:
```bash
git checkout -b <branch-name>
git push -u origin <branch-name> # this will push it to github
```

Commiting code:
- The .gitignore file takes care of NOT commiting setup and build files but for a sanity check, ensure you are not commiting files such as node_modules, .git, etc.
```bash
git add . # this will add all the modified files to staging
git commit -m "Commit Message"
```

Push code to remote branch:
```bash
git push -u origin <branch-name>
```
