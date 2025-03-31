import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { photoService } from '../services/api';

const PhotoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    fetchPhoto();
  }, [id]);

  const fetchPhoto = async () => {
    const response = await photoService.getPhoto(id);
    setPhoto(response.data);
  };

  const handleDelete = async () => {
    await photoService.deletePhoto(id);
    navigate('/');
  };

  if (!photo) return <div>Loading...</div>;

  return (
    <div className="photo-detail">
      <img src={photo.image} alt={photo.title} />
      <h2>{photo.title}</h2>
      <p>{photo.description}</p>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={() => navigate(`/photo/${id}/edit`)}>Edit</button>
      <button onClick={() => navigate('/')}>Back to Dashboard</button>
    </div>
  );
};

export default PhotoDetail;