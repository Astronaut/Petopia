import React, { useState } from 'react';
import axios from 'axios';

function AddPostPage() {
    const [fileInput, setFileInput] = useState(null);
    const [bio, setBio] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fileInput) {
            alert('Please select an image.');
            return;
        }

        const formData = new FormData();
        formData.append('file', fileInput);
        formData.append('name', name);
        formData.append('bio', bio);

        try {
              const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                alert('Data added successfully!');
                setName('');
                setBio('');
                setFileInput(null);
            } else {
                alert('Error adding data.');
            }
        } catch (error) {
            console.error("Error uploading:", error);
            alert('Failed to upload. Please try again.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={(e) => setFileInput(e.target.files[0])} />
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <textarea placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default AddPostPage;
