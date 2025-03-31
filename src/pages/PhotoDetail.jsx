import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { photoService, folderService } from '../services/api';

const PhotoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [folders, setFolders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    folder: ''
  });

  useEffect(() => {
    fetchPhoto();
    fetchFolders();
  }, [id]);

  const fetchPhoto = async () => {
    try {
      const response = await photoService.getPhoto(id);
      setPhoto(response.data);
      setEditData({
        title: response.data.title,
        description: response.data.description || '',
        folder: response.data.folder || ''
      });
    } catch (error) {
      console.error('Error fetching photo:', error);
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await folderService.getAllFolders();
      setFolders(response.data);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      try {
        await photoService.deletePhoto(id);
        navigate('/');
      } catch (error) {
        console.error('Error deleting photo:', error);
        alert('Failed to delete photo');
      }
    }
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await photoService.updatePhoto(id, editData);
      fetchPhoto();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating photo:', error);
      alert('Failed to update photo');
    }
  };

  if (!photo) return <div>Loading...</div>;

  return (
    <div className="photo-detail">
      <div className="photo-container">
        <img src={photo.image} alt={photo.title} className="full-image" />
      </div>
      
      {!isEditing ? (
        <div className="photo-info">
          <h2>{photo.title}</h2>
          {photo.description && <p className="description">{photo.description}</p>}
          {photo.folder && (
            <p className="folder-info">
              In folder: <Link to={`/folder/${photo.folder}`}>{folders.find(f => f.id === photo.folder)?.name || 'Unknown Folder'}</Link>
            </p>
          )}
          <div className="action-buttons">
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              Edit Details
            </button>
            <button className="delete-button" onClick={handleDelete}>
              Delete Photo
            </button>
          </div>
        </div>
      ) : (
        <div className="edit-form">
          <h3>Edit Photo Details</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={editData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={editData.description}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="folder">Folder</label>
              <select
                id="folder"
                name="folder"
                value={editData.folder}
                onChange={handleChange}
              >
                <option value="">No Folder</option>
                {folders.map(folder => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-button">
                Save Changes
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setIsEditing(false);
                  setEditData({
                    title: photo.title,
                    description: photo.description || '',
                    folder: photo.folder || ''
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <Link to="/" className="back-link">Back to Dashboard</Link>
    </div>
  );
};

export default PhotoDetail;