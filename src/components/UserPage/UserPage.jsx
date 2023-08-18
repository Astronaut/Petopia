import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Card, CardActionArea, CardMedia, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, Button, DialogActions } from '@material-ui/core';
import axios from 'axios';
import './UserPage.css';

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

function UserPage() {
  const classes = useStyles();
  const user = useSelector((store) => store.user);
  const [userPhotos, setUserPhotos] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    axios.get('/api/user/photos')
    .then((response) => {
      // Sorting in descending order
      const sortedPhotos = response.data.sort((a, b) => b.id - a.id);  
      setUserPhotos(sortedPhotos);
    })
    .catch((error) => {
      console.error('Error fetching user photos:', error);
    });
  }, []);

  const handlePhotoClick = (photo) => {
    console.log("Photo wclicked:", photo);
    setSelectedPhoto(photo);
    setOpen(true);
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

  const orderedPhotos = generateSnakeOrder(userPhotos);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        <h2>{user.username}</h2>
        <Grid container spacing={3} className="pets">
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
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
