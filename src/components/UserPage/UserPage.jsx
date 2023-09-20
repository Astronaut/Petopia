import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import { Card, CardActionArea, CardMedia, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, Button, DialogActions, TextField } from '@mui/material';
import axios from 'axios';
import './UserPage.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
  },
});

const Container = styled('div')({
  maxWidth: 1600,
  margin: '0 auto',
});

const StyledGridItem = styled(Grid)({
  maxWidth: 400,
  minWidth: 397,
  height: 460,
  margin: '0 auto',
});

const StyledCardMedia = styled(CardMedia)({
  height: 400,
  width: '100%',
  margin: '0 auto',
});

function UserPage() {
  const user = useSelector((store) => store.user);
  const [userPhotos, setUserPhotos] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCaption, setEditedCaption] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;

    axios.get('/api/user/photos')
    .then((response) => {
      const sortedPhotos = response.data.sort((a, b) => b.id - a.id);
      if (isMounted) setUserPhotos(sortedPhotos);
    })
    .catch((error) => {
      console.error('Error fetching user photos:', error);
      setErrorMessage('Failed to fetch photos.');
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePhotoClick = ({ id, caption }) => {
    setSelectedPhoto({ id, caption });
    setEditedCaption(caption);
    setOpen(true);
  };
  
  const handleSave = () => {
    const updatedPhotos = userPhotos.map(photo => 
        photo.id === selectedPhoto.id ? { ...photo, caption: editedCaption } : photo
    );

    setUserPhotos(updatedPhotos);
    setSelectedPhoto(prev => ({ ...prev, caption: editedCaption }));
    setIsEditing(false);

    axios.put(`/api/user/photos/${selectedPhoto.id}`, {
        caption: editedCaption
    })
    .catch(error => {
        console.error('Error updating caption:', error);
        setErrorMessage('Failed to update caption.');

        setUserPhotos(userPhotos);
        setSelectedPhoto(prev => ({ ...prev, caption: prev.caption }));
    });
};

  const handleDelete = (photoId) => {
    axios.delete(`/api/user/photos/${photoId}`)
      .then(() => {
        setUserPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== photoId));
        setOpen(false);
      })
      .catch(error => {
        console.error('Error deleting photo:', error);
        setErrorMessage('Failed to delete photo.');
      });
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setEditedCaption('');
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
      <Container>
        <div className="header">
          <h2>{user.username}</h2>
        </div>
        <Grid container spacing={3} className="pets">
          {orderedPhotos.map((photo) => (
            <StyledGridItem item xs={12} sm={6} md={3} lg={2} key={photo.id}>
              <Card onClick={() => handlePhotoClick(photo)}>
                <CardActionArea>
                  <StyledCardMedia
                    component="img"
                    image={photo.image_url}
                    title={`Photo ${photo.id}`}
                  />
                </CardActionArea>
                <div style={{ textAlign: 'center', padding: '10px' }}>
                  {photo.likes} {photo.likes === 1 ? 'Like' : 'Likes'}
                </div>
              </Card>
            </StyledGridItem>
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
                {isEditing ? (
                    <TextField 
                        fullWidth
                        value={editedCaption}
                        onChange={(e) => setEditedCaption(e.target.value)}
                    />
                ) : (
                    <DialogContentText>
                        {selectedPhoto?.caption}
                    </DialogContentText>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
                {isEditing ? (
                    <>
                        <Button onClick={() => setIsEditing(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} color="primary">
                            Save
                        </Button>
                    </>
                ) : (
                    <>
                        <Button onClick={() => {
                          setIsEditing(true);
                          setEditedCaption(selectedPhoto?.caption);
                        }} color="primary">
                            Edit
                        </Button>
                        <Button 
                            onClick={() => handleDelete(selectedPhoto?.id)} 
                            color="secondary"
                        >
                            Delete
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
        {errorMessage && (
            <Snackbar 
                open={!!errorMessage}
                message={errorMessage}
                autoHideDuration={6000}
                onClose={() => setErrorMessage(null)}
            />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default UserPage;
