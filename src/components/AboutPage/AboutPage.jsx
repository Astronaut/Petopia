import React from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, Box, List, ListItem, ListItemText, Button } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import petopia from './petopia.png'; 

function AboutPage() {
  const history = useHistory();

  const handleJoinFunClick = () => {
    history.push('/registration');
  };

  return (
    <Box className="container" p={4} style={{ maxWidth: '830px', margin: 'auto' }}>
      
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        Welcome to the World of Petopia! <PetsIcon color="primary" /> 
      </Typography>
      
      <Box mt={3} mb={5}>
        <Typography variant="body1">
          A place where our furry, feathery, and scaly friends find their own special corner of the digital realm! 🐶🐱🐭🐦🦎
        </Typography>
        <Typography variant="body1" mt={2}>
          Petopia thrives to create the go-to place to show off our amazing pets, share their daily adventures, and interact with other fellow friends.
        </Typography>
      </Box>
        
      <Typography variant="h5" fontWeight="bold" gutterBottom>Why Petopia?</Typography>
      <List dense>
        <ListItem disablePadding>
          <ListItemText 
            primary={
              <><Typography variant="body1" component="span" fontWeight="bold" color="primary">Create Profiles:</Typography> Just like us humans, pets can now have their very own profiles.</>
            }
          />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText 
            primary={
              <><Typography variant="body1" component="span" fontWeight="bold" color="primary">Share Photos:</Typography> Got a cute photo of your pet? Or maybe they're doing that hilarious thing again? Share it with the world!</>
            }
          />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText 
            primary={
              <><Typography variant="body1" component="span" fontWeight="bold" color="primary">Like and Appreciate:</Typography> Show some love! Pets (with a little help from their humans) can like and appreciate each other's posts.</>
            }
          />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText 
            primary={
              <><Typography variant="body1" component="span" fontWeight="bold" color="primary">Simple and Fun:</Typography> We ensure a fun environment for all our users, and are continuously working to add additional cool features.</>
            }
          />
        </ListItem>
      </List>  

      <Box mt={5} display="flex" justifyContent="center">
        <img src={petopia} alt="Petopia" />
      </Box>

      <Box mt={5} display="flex" justifyContent="center">
        <Button variant="contained" color="primary" size="large" onClick={handleJoinFunClick}>
          Join the Fun!
        </Button>
      </Box>

    </Box>
  );
}

export default AboutPage;
