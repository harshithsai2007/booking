# LuxStay - Hotel Booking Platform

LuxStay is a premium hotel booking platform built with React and Node.js, utilizing MongoDB Atlas for robust data storage and JWT for secure authentication.

## Features

- **Modern UI:** Sleek, dark-themed design with smooth animations.
- **Hotel Search:** Advanced search and filtering for hotels in Andhra Pradesh and Telangana.
- **Booking System:** Seamless booking creation with real-time price calculation.
- **My Bookings:** Track and manage your hotel reservations.
- **MongoDB Integration:** Powered by MongoDB Atlas for scalable data management.
- **JWT Auth:** Secure, custom authentication system (replacing Firebase).

## Project Structure

- `client/`: React frontend (Vite, TypeScript, Tailwind CSS, Framer Motion).
- `server/`: Express backend (TypeScript, Mongoose, JWT).

## Setup Instructions

### Backend (Server)
1. Navigate to `server/`
2. Install dependencies: `npm install`
3. Configure `.env` with:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: Secret key for token signing.
   - `PORT`: Server port (default 5000).
4. Seed the database: `npm run seed` (optional, for initial hotel data).
5. Run server: `npm run dev`

### Frontend (Client)
1. Navigate to `client/`
2. Install dependencies: `npm install`
3. Configure `.env` with:
   - `VITE_API_URL`: Backend API URL (e.g., http://localhost:5000/api).
4. Run client: `npm run dev`

## Deployment & Repository
Pushed to: [https://github.com/harshithsai2007/hotelAG.git](https://github.com/harshithsai2007/hotelAG.git)
