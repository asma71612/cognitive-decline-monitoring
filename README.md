# Cognitive Decline Monitoring - Setup Guide

This repository contains the code for the **Cognitive Decline Monitoring** application. It consists of two main parts:
- **Backend**: A Spring Boot application to handle the logic and API endpoints.
- **Frontend**: A React application for the user interface.

*Please make sure you are working on a separate branch and not commiting to main - See 'Git Basics' below for instructions**

## Prerequisites

Before you start, ensure you have the following installed on your system:

- **Java 11 or higher**
- **Maven** (for building the backend)
- **Node.js and npm** (for running the frontend)

## Current Versions
Here are the versions of the tools and technologies currently being used for this project. You do not have to use these version, but just ensure to update your dependencies locally if you choose to deviate.

- **Java**: 21.0.1
- **Maven**: 3.9.9
- **Node.js**: 18.20.5
- **npm**: 10.8.2
- **React**: 18.3.1
- **Spring Boot**: 3.4.0 (already included in pom.xml)

## Step 1: Install Java 11 (or higher)

To run the backend, you need to have Java 11 or higher installed. You can download Java from [AdoptOpenJDK](https://adoptopenjdk.net/) or [Oracle's JDK page](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html).

After installation, verify the Java version:
```bash
java -version
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

## Stopping the Server
Simply do `Ctrl + C` or `Cmd + C` in the terminal to terminate the batch job

## Troubleshooting
**Issue: Backend or Frontend not starting**

If you face issues with the backend or frontend not starting, ensure that:
1. You have installed all the dependencies using npm install and mvn clean install.
2. There are no port conflicts. Make sure the ports 8080 (for backend) and 3000 (for frontend) are not in use by other applications.

**Issue: Maven or Node.js not found**

If you get errors like command not found, ensure that both Maven and Node.js are correctly installed and added to your system's PATH.

**Issues: Missing Maven Wrapper (mvnw)**

If the Maven wrapper (mvnw) is missing or not working, you may need to regenerate it by running mvn wrapper:wrapper in the backend directory (assuming Maven is already installed).

## Git Basics
Create a new branch:
```bash
git checkout -b <branch-name>
git push -u origin <branch-name> # this will push it to github
```

Commiting code:
- the .gitignore file takes care of NOT commiting setup and build files but for a sanity check, ensure you are not commiting files such as node_modules, .git, etc.
```bash
git add . # this will add all the modified files to staging
git commit -m "Commit Message"
```

Push code to remote branch:
```bash
git push -u origin <branch-name>
```
