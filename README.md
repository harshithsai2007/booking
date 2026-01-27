# LuxStay - Hotel Booking Platform (Prototype)

LuxStay is a premium hotel booking platform prototype built with React and Node.js, utilizing Firebase Firestore for data storage.

## Features

- **Modern UI:** Sleek, dark-themed design with smooth animations.
- **Hotel Search:** Search for hotels in Andhra Pradesh and Telangana.
- **Booking System:** Guaranteed booking creation even with incomplete data (proto-friendly).
- **My Bookings:** track your reservations.
- **Firebase Integration:** Powered by Firestore for real-time data management.

## Project Structure

- `client/`: React frontend (Vite, TypeScript, Tailwind CSS, Framer Motion).
- `server/`: Express backend (TypeScript, Firebase Admin SDK).

## Setup Instructions

### Backend (Server)
1. Navigate to `server/`
2. Install dependencies: `npm install`
3. Configure `.env` with `JWT_SECRET` and other required variables.
4. Ensure `firebase-service-account.json` is present.
5. Run server: `npm run dev`

### Frontend (Client)
1. Navigate to `client/`
2. Install dependencies: `npm install`
3. Configure `.env` with `VITE_API_URL`.
4. Run client: `npm run dev`

## Deployment & Repository
Pushed to: [https://github.com/harshithsai2007/hotelAG.git](https://github.com/harshithsai2007/hotelAG.git)
