import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // TODO: Environment variable
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor for Auth Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getHotels = (params?: any) => api.get('/hotels', { params });
export const getFeaturedHotels = () => api.get('/hotels/featured');
export const getHotelById = (id: string) => api.get(`/hotels/${id}`);
export const createBooking = (data: any) => api.post('/bookings', data);
export const getMyBookings = () => api.get('/bookings/my');
export const loginUser = (data: any) => api.post('/auth/login', data);
export const registerUser = (data: any) => api.post('/auth/register', data);
export const getProfile = () => api.get('/users/profile');
export const updateProfile = (data: any) => api.put('/users/profile', data);

export default api;
