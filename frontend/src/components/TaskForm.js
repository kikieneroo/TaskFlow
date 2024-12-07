import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    TextField,
    MenuItem,
    Button,
    Typography,
    Box,
} from '@mui/material';

const TaskForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Pending');
    const [assignedTo, setAssignedTo] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAccessToken(token);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'http://localhost:5000/tasks/create',
                {
                    title,
                    description,
                    status,
                    assigned_to: assignedTo,
                    due_date: dueDate,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            alert(response.data.message || 'Task created successfully!');
        } catch (error) {
            console.error('Error creating task:', error.response?.data?.error || error.message);
            alert('Error creating task: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                mt: 4,
                p: 3,
                border: '1px solid #ddd',
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: '#fff',
            }}
        >
            <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ textAlign: 'center', mb: 3 }}
            >
                Create a New Task
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    required
                    multiline
                    rows={4}
                />
                <TextField
                    label="Status"
                    select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    fullWidth
                    required
                >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                </TextField>
                <TextField
                    label="Assign To"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    label="Due Date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    fullWidth
                    required
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Create Task
                </Button>
            </Box>
        </Container>
    );
};

export default TaskForm;
