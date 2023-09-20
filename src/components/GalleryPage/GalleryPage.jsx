import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardActionArea, CardMedia, Grid, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Button, Link } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';
import './GalleryPage.css';

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9',
      },
    },
});

const Container = styled('div')(({ theme }) => ({
  maxWidth: 1600,
  margin: '0 auto',
}));

const GridItem = styled(Grid)(({ theme }) => ({
  maxWidth: 400,
  minWidth: 397,
  height: 460,
  margin: '0 auto',
}));

const PhotoImage = styled(CardMedia)({
  height: 400,
  width: '100%',
  margin: '0 auto',
});

function GalleryPage() {
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
      <Container>
        <div className="header">
          <h2>Petopia Feed!</h2>
        </div>
        <Grid container spacing={3} className="feed">
          {orderedPhotos.map((photo) => (
            <GridItem item xs={12} sm={6} md={3} lg={2} key={photo.id}>
              <Card onClick={() => handlePhotoClick(photo)}>
                <CardActionArea>
                  <PhotoImage
                    component="img"
                    image={photo.image_url}
                    title={`Photo ${photo.id}`}
                  />
                </CardActionArea>
                <div style={{ textAlign: 'center', padding: '10px' }} className="likes-count">
                  {photo.likes} {photo.likes === 1 ? 'Like' : 'Likes'}
                </div>
              </Card>
            </GridItem>
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
      </Container>
    </ThemeProvider>
  );
}

export default GalleryPage;
