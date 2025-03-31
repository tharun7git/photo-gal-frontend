import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { photoService, folderService } from '../services/api';
import PhotoCard from '../components/PhotoCard';

const Dashboard = () => {
  const [photos, setPhotos] = useState([]);
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');

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

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    await folderService.createFolder(newFolderName);
    setNewFolderName('');
    fetchFolders();
  };

  return (
    <div className="dashboard">
      <h2>Your Photos</h2>
      <div className="photo-grid">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} onDelete={handleDeletePhoto} />
        ))}
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
      <form onSubmit={handleCreateFolder}>
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