import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { photoService, folderService } from '../services/api';
import PhotoCard from '../components/PhotoCard';

const Dashboard = () => {
  const [photos, setPhotos] = useState([]);
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    image: null,
    folder: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    fetchPhotos();
    fetchFolders();
  }, []);

  const fetchPhotos = async () => {
    const response = await photoService.getAllPhotos();
    setPhotos(response.data);
  };

  const fetchFolders = async () => {
    const response = await folderService.getAllFolders();
    setFolders(response.data);
  };

  const handleDeletePhoto = async (photoId) => {
    await photoService.deletePhoto(photoId);
    fetchPhotos();
  };

  const handleUpdatePhoto = async (photoId, updateData) => {
    await photoService.updatePhoto(photoId, updateData);
    fetchPhotos();
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    try {
      await folderService.createFolder(newFolderName);
      setNewFolderName('');
      fetchFolders();
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Failed to create folder');
    }
  };

  const handleInputChange = (e) => {
    setUploadData({
      ...uploadData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setUploadData({
      ...uploadData,
      image: e.target.files[0]
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.image) {
      alert('Please select an image to upload');
      return;
    }
    
    setIsUploading(true);
    try {
      await photoService.uploadPhoto(uploadData);
      setUploadData({
        title: '',
        description: '',
        image: null,
        folder: ''
      });
      // Reset the file input
      document.getElementById('dashboardPhotoUpload').value = '';
      fetchPhotos();
      setShowUploadForm(false);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="dashboard">
      <h2>Your Photos</h2>
      <button 
        onClick={() => setShowUploadForm(!showUploadForm)} 
        className="toggle-upload-btn"
      >
        {showUploadForm ? 'Hide Upload Form' : 'Upload New Photo'}
      </button>
      
      {/* Photo Upload Form */}
      {showUploadForm && (
        <div className="upload-section">
          <h3>Upload Photo</h3>
          <form onSubmit={handleUpload}>
            <div className="form-group">
              <label htmlFor="dashboardPhotoUpload">Select Image</label>
              <input
                type="file"
                id="dashboardPhotoUpload"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="title"
                value={uploadData.title}
                onChange={handleInputChange}
                placeholder="Photo Title"
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="description"
                value={uploadData.description}
                onChange={handleInputChange}
                placeholder="Description (optional)"
              />
            </div>
            <div className="form-group">
              <select 
                name="folder" 
                value={uploadData.folder} 
                onChange={handleInputChange}
              >
                <option value="">No Folder</option>
                {folders.map(folder => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload Photo'}
            </button>
          </form>
        </div>
      )}
      
      <div className="photo-grid">
        {photos.length > 0 ? (
          photos.map((photo) => (
            <PhotoCard 
              key={photo.id} 
              photo={photo} 
              onDelete={handleDeletePhoto}
              onUpdate={handleUpdatePhoto}
            />
          ))
        ) : (
          <p>No photos yet. Upload some photos!</p>
        )}
      </div>

      <h2>Your Folders</h2>
      <div className="folder-list">
        {folders.map((folder) => (
          <Link to={`/folder/${folder.id}`} key={folder.id}>
            <div className="folder-item">
              <h5>{folder.name}</h5>
            </div>
          </Link>
        ))}
      </div>
      <form onSubmit={handleCreateFolder} className="create-folder-form">
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="New Folder Name"
          required
        />
        <button type="submit">Create Folder</button>
      </form>
    </div>
  );
};

export default Dashboard;