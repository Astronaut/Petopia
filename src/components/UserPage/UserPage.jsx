import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Card, CardActionArea, CardMedia, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, Button, DialogActions } from '@material-ui/core';
import axios from 'axios';
import './UserPage.css';

const darkTheme = createTheme({
  palette: {
    type: 'dark',
  },
});

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: 1600,
    margin: '0 auto',
  },
  gridItem: {
    maxWidth: 400,
    minWidth: 397,
    height: 400,
    margin: '0 auto',
  },
  photoImage: {
    height: 400,
    width: '100%',
    margin: '0 auto',
  },
}));

function UserPage() {
  const classes = useStyles();
  const user = useSelector((store) => store.user);
  const [userPhotos, setUserPhotos] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    axios.get('/api/user/photos')
      .then((response) => {
        setUserPhotos(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user photos:', error);
      });
  }, []);

  const handlePhotoClick = (id) => {
    const selected = userPhotos.find((photo) => photo.id === id);
    setSelectedPhoto(selected);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (photoId) => {
    axios.delete(`/api/user/photos/${photoId}`)
      .then(() => {
        setUserPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== photoId));
        setOpen(false);
      })
      .catch(error => {
        console.error('Error deleting photo:', error);
      });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        <h2>{user.username}</h2>
        <Grid container spacing={3} className="pets">
          {userPhotos.map((photo) => (
            <Grid item xs={12} sm={6} md={3} lg={2} key={photo.id} className={classes.gridItem}>
              <Card onClick={() => handlePhotoClick(photo.id)}>
                <CardActionArea>
                  <CardMedia
                    className={classes.photoImage}
                    component="img"
                    image={photo.image_url}
                    title={`Photo ${photo.id}`}
                  />
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="photo-details-dialog-title"
        >
          <DialogTitle id="photo-details-dialog-title">
            {selectedPhoto?.name}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {selectedPhoto?.description}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button 
              onClick={() => handleDelete(selectedPhoto?.id)} 
              color="secondary"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}

export default UserPage;
