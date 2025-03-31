import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });
        
        localStorage.setItem('token', response.data.access);
        
        return apiClient(originalRequest);
      } catch (err) {
        // Refresh token expired, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/token/`, credentials);
    localStorage.setItem('token', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/users/`, userData);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },
  
  getCurrentUser: async () => {
    return apiClient.get('/users/');
  }
};

// Photo services
export const photoService = {
  getAllPhotos: () => apiClient.get('/photos/'),
  
  getPhotosByFolder: (folderId) => apiClient.get(`/photos/?folder=${folderId}`),
  
  getPhoto: (id) => apiClient.get(`/photos/${id}/`),
  
  uploadPhoto: (photoData) => {
    const formData = new FormData();
    formData.append('title', photoData.title);
    formData.append('description', photoData.description);
    formData.append('image', photoData.image);
    if (photoData.folder) {
      formData.append('folder', photoData.folder);
    }
    
    return apiClient.post('/photos/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  updatePhoto: (id, photoData) => {
    const formData = new FormData();
    
    if (photoData.title) formData.append('title', photoData.title);
    if (photoData.description) formData.append('description', photoData.description);
    if (photoData.image) formData.append('image', photoData.image);
    if (photoData.folder) formData.append('folder', photoData.folder);
    
    return apiClient.patch(`/photos/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deletePhoto: (id) => apiClient.delete(`/photos/${id}/`),
  
  movePhotoToFolder: (photoId, folderId) => 
    apiClient.post(`/photos/${photoId}/move_to_folder/`, { folder_id: folderId }),
};

// Folder services
export const folderService = {
  getAllFolders: () => apiClient.get('/folders/'),
  
  getFolder: (id) => apiClient.get(`/folders/${id}/`),
  
  createFolder: (name) => apiClient.post('/folders/', { name }),
  
  updateFolder: (id, name) => apiClient.patch(`/folders/${id}/`, { name }),
  
  deleteFolder: (id) => apiClient.delete(`/folders/${id}/`),
};

export default apiClient;