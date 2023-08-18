import React, { useState, useEffect } from 'react';
import { makeStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Card, CardActionArea, CardMedia, Grid, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Button, Link } from '@material-ui/core';
import axios from 'axios';
import './GalleryPage.css';

const darkTheme = createTheme({
    palette: {
      type: 'dark',
      primary: {
        main: '#90caf9',
      },
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
    height: 460,
    margin: '0 auto',
  },
  photoImage: {
    height: 400,
    width: '100%',
    margin: '0 auto',
  },
}));

function GalleryPage() {
  const classes = useStyles();
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    axios.get('/api/user/gallery')
      .then((response) => {
        setGalleryPhotos(response.data);
      })
      .catch((error) => {
        console.error('Error fetching gallery photos:', error);
      });
  }, []);

  const handlePhotoClick = (id) => {
    const selected = galleryPhotos.find((photo) => photo.id === id);
    setSelectedPhoto(selected);
    setOpen(true);
  };

  const handleLike = () => {
    axios.post(`/api/user/gallery/${selectedPhoto?.id}/like`)
      .then(response => {
        // Increases the like count
        const updatedGalleryPhotos = galleryPhotos.map(photo =>
          photo.id === selectedPhoto.id ? { ...photo, likes: Number(photo.likes) + 1 } : photo
        );

        setGalleryPhotos(updatedGalleryPhotos);
        console.log('Photo liked successfully!');
      })
      .catch(error => {
        console.error('Error liking the photo:', error);
      });
  };
  
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        <h2>Petopia Feed!</h2>
        <Grid container spacing={3} className="feed">
          {galleryPhotos.map((photo) => (
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
                <div style={{ textAlign: 'center', padding: '10px' }} className="likes-count">
                  {photo.likes} {photo.likes === 1 ? 'Like' : 'Likes'}
                </div>
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
            Photo Details
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {selectedPhoto?.caption}
            </DialogContentText>
            <DialogContentText>
              Posted by: <Link href={`/users/${selectedPhoto?.username}/photos`}>{selectedPhoto?.username}</Link>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLike} color="primary">
              Like
            </Button>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}

export default GalleryPage;
