import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="hotels" element={<Hotels />} />
          <Route path="hotels/:id" element={<HotelDetails />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="booking" element={<Booking />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
