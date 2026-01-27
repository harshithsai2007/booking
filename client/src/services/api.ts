import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor for Auth Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // Modern Axios usage for setting headers
        config.headers.set('Authorization', `Bearer ${token}`);
        console.log('🔗 Interceptor: Added token to request');
    } else {
        console.warn('⚠️ Interceptor: No token found in localStorage');
    }
    return config;
});

// Response Interceptor for handling 401s
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('🔒 Unauthorized access - clearing session');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Check if not already on login page to avoid loops
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const getHotels = (params?: any) => api.get('/hotels', { params });
export const getFeaturedHotels = () => api.get('/hotels/featured');
export const getHotelById = (id: string) => api.get(`/hotels/${id}`);
export const createBooking = (data: any) => api.post('/bookings', data);
export const getMyBookings = () => api.get('/bookings/my');
export const loginUser = (data: any) => api.post('/auth/login', data);
export const registerUser = (data: any) => api.post('/auth/register', data);
export const getProfile = () => api.get('/users/profile');
export const updateProfile = (data: any) => api.put('/users/profile', data);
export const getFavorites = () => api.get('/users/favorites');
export const toggleFavorite = (hotelId: string) => api.post('/users/favorites/toggle', { hotelId });

export default api;
