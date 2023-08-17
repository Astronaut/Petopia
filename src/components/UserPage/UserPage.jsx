import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import LogOutButton from '../LogOutButton/LogOutButton';
import axios from 'axios';

function UserPage() {
  const user = useSelector((store) => store.user);
  console.log('Redux store user:', user); 
  const [userPhotos, setUserPhotos] = useState([]);

  useEffect(() => {
    // Match the backend endpoint
    axios.get('/api/user/photos')
      .then((response) => {
        console.log('Fetched photos:', response.data);
        setUserPhotos(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user photos:', error);
      });
  }, []);

  return (
    <div className="container">
      <h2>{user.username}</h2>

      <Grid container spacing={2}>
        {userPhotos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={photo.id}>
            <img src={photo.image_url} alt={`Photo ${photo.id}`} style={{ width: '100%' }} />
            <p>Name: {photo.name}</p>
            <p>Bio: {photo.bio}</p>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default UserPage;
