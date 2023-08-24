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
  const [userHasLiked, setUserHasLiked] = useState(false);

  useEffect(() => {
    axios.get('/api/user/gallery')
      .then((response) => {
        setGalleryPhotos(response.data);
      })
      .catch((error) => {
        console.error('Error fetching gallery photos:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedPhoto) {
      console.log("Selected photo's userHasLiked value:", selectedPhoto.userHasLiked);
      setUserHasLiked(selectedPhoto.userhasliked);
    }
}, [selectedPhoto]);

const handlePhotoClick = (photo) => {
  console.log("Photo clicked:", photo);
  setSelectedPhoto(photo);
  setOpen(true);
};

// function to fetch the latest gallery data
const fetchGalleryData = () => {
  axios.get('/api/user/gallery')
  .then((response) => {
      setGalleryPhotos(response.data);
      if (selectedPhoto) {
          const updatedPhoto = response.data.find(photo => photo.id === selectedPhoto.id);
          if (updatedPhoto) {
              setSelectedPhoto(updatedPhoto);
              setUserHasLiked(updatedPhoto.userHasLiked);
          }
      }
  })
  .catch((error) => {
      console.error('Error fetching gallery photos:', error);
  });
};

const handleLike = () => {
  axios.post(`/api/user/gallery/${selectedPhoto?.id}/like`)
  .then(response => {
      if (response.data.status === 'liked') {
          setUserHasLiked(true);
      } else if (response.data.status === 'unliked') {
          setUserHasLiked(false);
      }
      // Fetch the latest gallery data
      fetchGalleryData();
  })
  .catch(error => {
      console.error('Error liking/unliking the photo:', error.response?.data || error);
  });
};

  const handleClose = () => {
    setOpen(false);
  };

  const generateSnakeOrder = (arr) => {
    let result = [];
    let rows = Math.ceil(arr.length / 4);

    for (let i = 0; i < rows; i++) {
      if (i % 2 === 0) {
        result = result.concat(arr.slice(i * 4, i * 4 + 4));
      } else {
        result = result.concat(arr.slice(i * 4, i * 4 + 4).reverse());
      }
    }

    return result;
  };

  const orderedPhotos = generateSnakeOrder(galleryPhotos);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        <div className="header">
          <h2>Petopia Feed!</h2>
        </div>
        <Grid container spacing={3} className="feed">
          {orderedPhotos.map((photo) => (
            <Grid item xs={12} sm={6} md={3} lg={2} key={photo.id} className={classes.gridItem}>
              <Card onClick={() => handlePhotoClick(photo)}>
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
              {userHasLiked ? 'Unlike' : 'Like'}
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
