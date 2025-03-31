import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { photoService, folderService } from '../services/api';
import PhotoCard from '../components/PhotoCard';

const FolderView = () => {
  const { id } = useParams();
  const [folder, setFolder] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchFolder();
    fetchPhotos();
  }, [id]);

  const fetchFolder = async () => {
    const response = await folderService.getFolder(id);
    setFolder(response.data);
  };

  const fetchPhotos = async () => {
    const response = await photoService.getPhotosByFolder(id);
    setPhotos(response.data);
  };

  const handleDeletePhoto = async (photoId) => {
    await photoService.deletePhoto(photoId);
    fetchPhotos();
  };

  if (!folder) return <div>Loading...</div>;

  return (
    <div className="folder-view">
      <h2>Folder: {folder.name}</h2>
      <div className="photo-grid">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} onDelete={handleDeletePhoto} />
        ))}
      </div>
      <Link to="/">Back to Dashboard</Link>
    </div>
  );
};

export default FolderView;