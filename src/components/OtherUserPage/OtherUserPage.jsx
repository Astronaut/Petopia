import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardActionArea, CardMedia, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, Button, DialogActions } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';
import './OtherUserPage.css'; 

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

function OtherUserPage({ match }) {
  const [userPhotos, setUserPhotos] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const username = match.params.username;

  useEffect(() => {
    axios.get(`/api/users/${username}/photos`)
      .then((response) => {
        const sortedPhotos = response.data.sort((a, b) => b.id - a.id);
        setUserPhotos(sortedPhotos);
      })
      .catch((error) => {
        console.error(`Error fetching ${username}'s photos:`, error);
      });
  }, [username]);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const orderedPhotos = generateSnakeOrder(userPhotos);

  return (
    <ThemeProvider theme={darkTheme}>
      <Container>
        <h2>{username}'s Photos</h2>
        <Grid container spacing={3} className="pets">
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}

export default OtherUserPage;
