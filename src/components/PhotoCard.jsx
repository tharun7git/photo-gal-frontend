import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PhotoCard = ({ photo, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: photo.title,
    description: photo.description || ''
  });

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete "${photo.title}"?`)) {
      onDelete(photo.id);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(false);
    setEditData({
      title: photo.title,
      description: photo.description || ''
    });
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await onUpdate(photo.id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating photo:', error);
      alert('Failed to update photo');
    }
  };

  return (
    <div className="photo-card">
      {!isEditing ? (
        <>
          <Link to={`/photo/${photo.id}/${encodeURIComponent(photo.image.split('/').pop())}`}>
            <div className="photo-image">
              <img src={photo.image} alt={photo.title} />
            </div>
            <div className="photo-info">
              <h4>{photo.title}</h4>
              {photo.description && <p>{photo.description}</p>}
            </div>
          </Link>
          <div className="photo-actions">
            <button className="edit-button" onClick={handleEdit}>
              Edit
            </button>
            <button className="delete-button" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </>
      ) : (
        <div className="photo-edit-form">
          <div className="photo-image">
            <img src={photo.image} alt={photo.title} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="title"
                value={editData.title}
                onChange={handleChange}
                placeholder="Photo Title"
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="description"
                value={editData.description}
                onChange={handleChange}
                placeholder="Description (optional)"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="save-button">
                Save
              </button>
              <button type="button" className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PhotoCard;
