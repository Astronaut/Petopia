import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, TextareaAutosize, Paper, Typography } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 500,
        margin: 'auto',
        padding: theme.spacing(4),
        marginTop: theme.spacing(8),
        textAlign: 'center',
        backgroundColor: '#333',
        color: '#fff'
    },
    input: {
        width: '100%',
        marginBottom: theme.spacing(2),
        color: '#fff',
        backgroundColor: '#444',
        borderColor: '#555',
    },
    button: {
        marginTop: theme.spacing(2)
    },
    fileInput: {
        display: 'none'
    },
    uploadBtn: {
        marginBottom: theme.spacing(2)
    }
}));

function AddPostPage() {
    const classes = useStyles();
    const [fileInput, setFileInput] = useState(null);
    const [caption, setCaption] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fileInput) {
            alert('Please select an image.');
            return;
        }

        const formData = new FormData();
        formData.append('file', fileInput);
        formData.append('caption', caption);

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                alert('Data added successfully!');
                setFileInput(null);
            } else {
                alert('Error adding data.');
            }
        } catch (error) {
            console.error("Error uploading:", error.response.data);
            alert(`Error: ${error.response.data.message || 'Failed to upload. Please try again.'}`);
        }
    };

    return (
        <Paper className={classes.root}>
            <Typography variant="h5" gutterBottom>
                Add Post
            </Typography>
            <form onSubmit={handleSubmit}>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setFileInput(e.target.files[0])} 
                    id="imageUpload"
                    className={classes.fileInput}
                />
                <label htmlFor="imageUpload">
                    <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        className={classes.uploadBtn}
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload Image
                    </Button>
                </label>
                <TextareaAutosize 
                    rowsMin={5}
                    placeholder="Caption"
                    className={classes.input}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    style={{
                        color: '#fff'
                    }}
                />
                <Button 
                    variant="contained" 
                    color="primary" 
                    type="submit"
                    className={classes.button}
                >
                    Submit
                </Button>
            </form>
        </Paper>
    );
}
export default AddPostPage;
