import React, { useState, useEffect } from 'react';
import axios from '../api';
import {
    Container,
    Typography,
    Card,
    CardContent,
    CardActions,
    TextField,
    Grid,
    IconButton,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({});
    const [isRegularUser, setIsRegularUser] = useState(false); // Track user role

    useEffect(() => {
        fetchTasks();
        // Assume user role is fetched from localStorage or another API
        setIsRegularUser(localStorage.getItem('role') === 'regular');
    }, []);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tasks', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this task?');
        if (!confirmDelete) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task.id);
        // Allow only specific fields to be edited for regular users
        setFormData(
            isRegularUser
                ? { progress_note: task.progress_note, status: task.status }
                : task
        );
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/tasks/${editingTask}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setEditingTask(null);
            fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Task List
            </Typography>
            <Grid container spacing={3}>
                {tasks.map((task) => (
                    <Grid item xs={12} sm={6} md={4} key={task.id}>
                        <Card variant="outlined" sx={{ position: 'relative' }}>
                            <CardContent>
                                {editingTask === task.id ? (
                                    <>
                                        {!isRegularUser && (
                                            <>
                                                <TextField
                                                    name="title"
                                                    label="Title"
                                                    value={formData.title || ''}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    margin="normal"
                                                />
                                                <TextField
                                                    name="description"
                                                    label="Description"
                                                    value={formData.description || ''}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                    margin="normal"
                                                />
                                            </>
                                        )}
                                        <TextField
                                            name="progress_note"
                                            label="Progress Note"
                                            value={formData.progress_note || ''}
                                            onChange={handleChange}
                                            fullWidth
                                            multiline
                                            rows={2}
                                            margin="normal"
                                        />
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel id="status-label">Status</InputLabel>
                                            <Select
                                                labelId="status-label"
                                                name="status"
                                                value={formData.status || 'Pending'}
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="Pending">Pending</MenuItem>
                                                <MenuItem value="In Progress">In Progress</MenuItem>
                                                <MenuItem value="Completed">Completed</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </>
                                ) : (
                                    <>
                                        <Typography variant="h6">{task.title}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {task.description}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Progress Note:</strong> {task.progress_note}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Status:</strong> {task.status}
                                        </Typography>
                                    </>
                                )}
                            </CardContent>
                            <CardActions>
                                {editingTask === task.id ? (
                                    <>
                                        <IconButton color="primary" onClick={handleUpdate}>
                                            <SaveIcon />
                                        </IconButton>
                                        <IconButton
                                            color="secondary"
                                            onClick={() => setEditingTask(null)}
                                        >
                                            <CancelIcon />
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <IconButton color="primary" onClick={() => handleEdit(task)}>
                                            <EditIcon />
                                        </IconButton>
                                        {!isRegularUser && (
                                            <IconButton color="error" onClick={() => handleDelete(task.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </>
                                )}
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default TaskList;
