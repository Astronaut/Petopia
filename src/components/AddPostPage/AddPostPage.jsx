import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextareaAutosize, Paper, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
    maxWidth: 500,
    margin: 'auto',
    padding: theme.spacing(4),
    marginTop: theme.spacing(8),
    textAlign: 'center',
    backgroundColor: '#333',
    color: '#fff',
}));

const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
    width: '100%',
    marginBottom: theme.spacing(2),
    color: '#fff',
    backgroundColor: '#444',
    borderColor: '#555',
}));

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
}));

const FileInput = styled('input')({
    display: 'none',
});

const UploadButton = styled(Button)(({ theme }) => ({
    marginBottom: theme.spacing(2),
}));

function AddPostPage() {
    const [fileInput, setFileInput] = useState(null);
    const [caption, setCaption] = useState('');
    const [previewURL, setPreviewURL] = useState(null);

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

                // Reset states
                setCaption('');
                setFileInput(null);
                setPreviewURL(null);

                // Clear the file input cache
                document.getElementById('imageUpload').value = '';

            } else {
                alert('Error adding data.');
            }
        } catch (error) {
            console.error("Error uploading:", error.response.data);
            alert(`Error: ${error.response.data.message || 'Failed to upload. Please try again.'}`);
        }
    };

    return (
        <StyledPaper>
            <Typography variant="h5" gutterBottom>
                Add Post
            </Typography>
            <form onSubmit={handleSubmit}>
                <FileInput 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                        setFileInput(e.target.files[0]);
                        setPreviewURL(URL.createObjectURL(e.target.files[0]));
                    }}
                    id="imageUpload"
                />
                <label htmlFor="imageUpload">
                    <UploadButton
                        variant="contained"
                        color="primary"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload Image
                    </UploadButton>
                </label>

                {previewURL && (
                    <div style={{marginBottom: '20px'}}>
                        <img src={previewURL} alt="Preview" style={{maxWidth: '50%', height: 'auto'}} />
                    </div>
                )}

                <StyledTextarea 
                    rowsMin={5}
                    placeholder="Caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                />
                <StyledButton 
                    variant="contained" 
                    color="primary" 
                    type="submit"
                >
                    Submit
                </StyledButton>
            </form>
        </StyledPaper>
    );
}

export default AddPostPage;
