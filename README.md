# Cognitive Decline Monitoring - Setup Guide

This repository contains the code for the **Cognitive Decline Monitoring** application. It consists of two main parts:
- **Backend**: A Spring Boot application using Python and Flask to handle the logic and API endpoints.
- **Frontend**: A React application using JavaScript for the user interface.

![image](https://github.com/user-attachments/assets/0be2c38b-4098-4f70-b8d7-8b6d960cbe33)

*Please make sure you are working on a separate branch and not commiting to main - See 'Git Basics' below for instructions**

## Prerequisites

Before you start, ensure you have the following installed on your system:

- **Java 11 or higher**
- **Maven** (for building the backend)
- **Node.js and npm** (for running the frontend)
- **Python 3.9** (for running the backend)

## Current Versions
Here are the versions of the tools and technologies currently being used for this project. You do not have to use these version, but just ensure to update your dependencies locally if you choose to deviate—Note that eye tracking will not work if you deviate.

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
- **Express.js** 4.21.2
- **Matplotlib**: 3.9.4 (This is not needed but if it is giving you errors, downgrade to this version)
- **Mediapipe**: 0.10.21
- **Numpy**: 1.24.4
- **Pandas**: 2.1.4
- **Ptgaze**: 0.2.8
- **Pycaret**: 3.3.2
- **Pygame**: 2.6.1
- **Pymovement**: 0.19.0
- **Scipy**: 1.8.1

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

## Step 9: AWS Setup

Before proceeding, ensure you have pulled the latest changes from `server.cjs` locally.

Begin by signing up for a free tier [AWS account](https://signin.aws.amazon.com/signup?request_type=register) if you haven't already. This gives us:
- 5 GB of standard storage for our S3 bucket, and
- 60 minutes per month free on AWS transcribe

At this point, you should be able to sign into your account and access [your console](https://us-east-2.console.aws.amazon.com/console). This is where you can access and manage all your AWS services. The 3 that will pertain to us are S3 (storage), IAM (identity and access management) and Transcribe.

You can search for these services on your console using the search bar. Otherwise they have been linked below for convenience:
- S3: https://us-east-2.console.aws.amazon.com/s3
- IAM: https://us-east-1.console.aws.amazon.com/iam
- Transcribe: https://us-east-2.console.aws.amazon.com/transcribe

First, we'll head to the Identity and Access Management dashboard to set up your user and define access to our S3 bucket. 

From the left-hand panel, click on **Users > Create User**. You don't need to change any of the default settings. When you're done, click on your newly-created user. Noting a few important things here:
- A top Summary panel with your **ARN (Amazon Resource Name)** and on the right the ability to **Create Access Key**
- Under the **Permission** tab, **Permission Policies** (by default you should have 0, but we're going to add some soon).

### **CREATE ACCESS KEY**

Start by clicking **Create Access Key** in your Summary panel of your user. It will ask you for your use case for which you can specify "Local Code".

**ONCE YOUR ACCESS KEY IS CREATED MAKE NOTE OF BOTH YOUR ACCESS KEY AND SECRET ACCESS KEY.** Sorry for yelling but this is the only time you can view your access keys here so write them down.

### **ATTACHING USER POLICIES**

This step ensures your user has access to the appropriate AWS services. Go to **Permission Policies > Add Permission > Create Inline Policy**.

#### **a) S3 & Transcribe Full Access**

In Policy Editor, "Visual" should be selected.

Under "Select a Service", choose **S3**. Some new dropdowns will pop up:
- For "Actions Allowed", click on **All S3 actions (s3:*)**
- For "Resources", click on **All**

Scroll down to the "Add More Permissions" to which you're going to repeat the same steps for **Select a Service > Transcribe**

You can name your policy whatever you want (eg. s3AndTranscribeFullAccess).

#### **b) Cognify S3 Bucket Full Access**

In Policy Editor, "JSON" should be selected.

Paste the following JSON statement into the editor:

```JSON
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": [
				"s3:ListBucket",
				"s3:GetObject",
				"s3:DeleteObject",
				"s3:GetObjectAcl",
				"s3:PutObjectAcl",
				"s3:PutObject"
			],
			"Resource": [
				"arn:aws:s3:::cognify-capstone",
				"arn:aws:s3:::cognify-capstone/*"
			]
		}
	]
}

```

You can name your policy whatever you want (eg. cognifyBucketAccess).

**To [access the Cognify S3 Bucket](https://us-east-2.console.aws.amazon.com/s3/buckets/cognify-capstone?region=us-east-2&bucketType=general&tab=objects), reach out to Amena with your ARN so she can add it to the S3 bucket policy.**

### **VERIFY**
Next, based on your operating system install the AWS CLI. The steps are detailed here: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

Configure your AWS credentials using `aws configure` using your access key and secret access key. Ensure your region is set to `us-east-2`.

To verify you can read access from the S3 bucket, run `aws s3 ls s3://cognify-capstone` (with proper setup, this should return all the objects currently in the bucket ie. wav files and json files).

To verify write access to the S3 bucket, run `echo "test file" | aws s3 cp - s3://cognify-capstone/test.txt`. Navigate to the bucket to ensure that it was uploaded.

### **LOCAL REPO CHANGES**

In your root directory (aka at the same level as your `package.json` file), create a new file called `.env` and paste the following below:

```.env
AWS_ACCESS_KEY_ID={YOUR AWS ACCESS KEY GENERATED ABOVE}
AWS_SECRET_ACCESS_KEY={YOUR AWS SECRET ACCESS KEY GENERATED ABOVE}
AWS_REGION=us-east-2
S3_BUCKET_NAME=cognify-capstone
PORT=5001
```

To automatically install all the important libraries, run:
```bash
npm install
```

To run the Node.js server with Express, run:
```bash
node server.cjs
```

## How to Run the Application

In 3 seperate terminals, run the following:
```bash
# Run the language and memory games
node server.cjs
```

```bash
# Run any Python backend operations
cd demo/flask_api
python app.py
```

```bash
# Run the React web application
cd react_frontend
npm start
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
