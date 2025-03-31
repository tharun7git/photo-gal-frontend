import React from 'react';
import { useNavigate } from 'react-router-dom';

const PhotoCard = ({ photo, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = () => {
    onDelete(photo.id);
  };

  const handleEdit = () => {
    navigate(`/photo/${photo.id}`);
  };

  const handleDetails = () => {
    navigate(`/photo/${photo.id}`);
  };

  return (
    <div className="photo-card">
      <img src={photo.image} alt={photo.title} />
      <div className="photo-info">
        <h5>{photo.title}</h5>
        <p>{photo.description}</p>
        <div className="photo-actions">
          <button onClick={handleDetails}>Details</button>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;