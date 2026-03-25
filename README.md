# Lab Test Portal

This repository contains a React frontend (`frontend/`) and an Express backend (`backend/`).

Quick local run

- Frontend:

  - cd frontend
  - npm install
  - npm start

- Backend:
  - cd backend
  - npm install
  - npm run dev

Deployment notes

1. Create a GitHub repository and push this project.
2. The workflow `.github/workflows/deploy-frontend.yml` builds the React app and publishes it to GitHub Pages from the `main` branch.
3. To enable the backend deployment, connect this repository to a provider like Render or Railway and set the service root to `/backend`.

Environment variables

- Backend uses environment variables (for example `MONGODB_URI`, `JWT_SECRET`). Add them to your hosting provider or GitHub Secrets if using Actions for backend deploys.

If you'd like, I can push the repo to GitHub for you (I will need your permission to run commands locally or you can provide a GitHub remote URL).
