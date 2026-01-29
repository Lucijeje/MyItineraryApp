# My Itinerary App

A modern web application for creating and managing travel itineraries, day plans, and diary entries.

## Features

- 📅 **Itinerary Management**: Create, update, and delete travel itineraries
- 📝 **Day Plans**: Organize daily activities and schedules
- 📍 **Locations**: Add and manage locations for each day plan
- 📖 **Diary Entries**: Capture memories and experiences from your trips
- 🎨 **Modern UI**: Beautiful and responsive design

## Tech Stack

- **Frontend**: React, React Router, React Bootstrap, React Hook Form
- **Backend**: Node.js, Express
- **Storage**: JSON file-based storage

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Lucijeje/MyItineraryApp.git
cd MyItineraryApp
```

2. Install client dependencies:
```bash
cd client
npm install
```

3. Install server dependencies:
```bash
cd ../server
npm install
```

### Running Locally

1. Start the backend server:
```bash
cd server
npm start
```
The server will run on `http://localhost:2000`

2. Start the frontend (in a new terminal):
```bash
cd client
npm start
```
The app will open at `http://localhost:3000`

### Environment Variables

Create a `.env` file in the `client` directory:

```env
REACT_APP_API_URL=http://localhost:2000
```

For production, set `REACT_APP_API_URL` to your backend server URL.

## Deployment

### Backend (Heroku)

The backend is deployed on Heroku at: https://my-itineraty-app-15b4c02b28f6.herokuapp.com/

### GitHub Pages

The application is configured for automatic deployment to GitHub Pages using GitHub Actions.

1. Enable GitHub Pages in your repository settings:
   - Go to Settings > Pages
   - Source: GitHub Actions

2. Set up the API URL (optional):
   - Go to Settings > Secrets and variables > Actions
   - Add a secret named `REACT_APP_API_URL` with your backend server URL
   - If not set, it will default to `http://localhost:2000`

3. Push to the `master` branch to trigger automatic deployment

The app will be available at: `https://Lucijeje.github.io/MyItineraryApp`

**Note**: GitHub Pages only hosts static files. You'll need to host the backend server separately (e.g., on Heroku, Railway, Render, or similar services).

## Project Structure

```
MyItineraryApp/
├── client/          # React frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── config/      # Configuration files
│   └── public/      # Static assets
├── server/          # Express backend
│   ├── abl/         # Application Business Logic
│   ├── controller/  # Route controllers
│   ├── dao/         # Data Access Objects
│   └── helper/      # Helper functions
└── .github/         # GitHub Actions workflows
```

## License

This project is open source and available under the MIT License.
