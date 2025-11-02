# Interview Coach

## Overview
The Interview Coach is a web application designed to assist users in preparing for job interviews. It provides strong and generic answers to common interview questions while allowing users to input specific keywords related to their roles or skills. Users can also upload their CVs and receive an employability score based on their responses.

## Features
- **Interview Question Assistance**: Users can receive tailored answers to interview questions.
- **Keyword Input**: Users can input specific words related to their skills or roles to enhance their responses.
- **CV Upload**: Users can upload their CVs for analysis.
- **Employability Score**: The application calculates and displays an employability score based on user responses and CV analysis.

## Project Structure
The project is divided into two main parts: the client-side application built with React and the server-side application built with Node.js.

### Client
- **`client/src`**: Contains the main application code, including components, pages, services, and hooks.
- **`client/public/index.html`**: The entry point for the React application.
- **`client/package.json`**: Configuration file for the client-side application.

### Server
- **`server/src`**: Contains the server application code, including controllers, routes, services, and models.
- **`server/package.json`**: Configuration file for the server-side application.

## Setup Instructions
1. **Clone the Repository**:
   ```
   git clone <repository-url>
   cd interview-coach
   ```

2. **Install Dependencies**:
   - For the client:
     ```
     cd client
     npm install
     ```
   - For the server:
     ```
     cd ../server
     npm install
     ```

3. **Environment Variables**:
   - Copy the `.env.example` file to `.env` and configure the necessary environment variables.

4. **Run the Application**:
   - Start the server:
     ```
     cd server
     npm start
     ```
   - Start the client:
     ```
     cd ../client
     npm start
     ```

## Usage
- Navigate to the application in your web browser.
- Use the provided features to prepare for your interviews effectively.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.