import React, { useEffect, useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Grid,
    Alert,
    Card,
    CardContent,
} from '@mui/material';

const UserDashboard = () => {
    const [userId, setUserId] = useState(null); // State to store user ID
    const [tasks, setTasks] = useState([]);    // State to store tasks
    const [gamificationStats, setGamificationStats] = useState(null); // State for gamification stats
    const [editingTask, setEditingTask] = useState(null); // State for the task being edited
    const [editFormData, setEditFormData] = useState({
        title: '',
        status: '',
        progress_note: '',
    }); // State for edit form data
    const [message, setMessage] = useState(''); // State for error/success message
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUserId = localStorage.getItem('userId');
                const token = localStorage.getItem('accessToken');

                if (!storedUserId) {
                    const response = await axios.get('/profile', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const { user } = response.data;
                    setUserId(user.id);
                    localStorage.setItem('userId', user.id);
                } else {
                    setUserId(storedUserId);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get('/tasks', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTasks(response.data); // Store tasks in state
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        const fetchGamificationStats = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get('/gamification/stats', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setGamificationStats(response.data); // Store gamification stats
            } catch (error) {
                console.error('Error fetching gamification stats:', error);
            }
        };

        fetchTasks();
        fetchGamificationStats();
    }, []);

    const handleEditClick = (task) => {
        setEditingTask(task.id);
        setEditFormData({
            title: task.title,
            status: task.status,
            progress_note: task.progress_note || '', // Retain progress_note value
        });
    };

    const handleCancelClick = () => {
        setEditingTask(null);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    
    // const handleSaveClick = async (taskId) => {
    //     const userConfirmed = window.confirm("Are you sure you want to save these changes?");
    //     if (!userConfirmed) {
    //         return; // Exit the function if the user cancels the prompt.
    //     }
    
    //     try {
    //         const token = localStorage.getItem('accessToken');
    
    //         // Save the task changes
    //         await axios.put(`/tasks/${taskId}`, editFormData, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    
    //         // Update the task in the state
    //         setTasks((prevTasks) =>
    //             prevTasks.map((task) =>
    //                 task.id === taskId
    //                     ? { ...task, ...editFormData }
    //                     : task
    //             )
    //         );
    
    //         // Check if the status was changed to "Completed"
    //         // if (editFormData.status === "Completed") {
    //         //     // Call the updatePoints API without passing parameters
    //         //     await axios.post('/gamification/update-points', null, {
    //         //         headers: {
    //         //             Authorization: `Bearer ${token}`,
    //         //         },
    //         //     });
    //         // }
    
    //         // Exit editing mode and show success message
    //         setEditingTask(null);
    //         setMessage('Task updated successfully!');
    //     } catch (error) {
    //         console.error('Error updating task:', error);
    //         setMessage('Error updating task!');
    //     }
    // };
    



    const handleSaveClick = async (taskId) => {
        const userConfirmed = window.confirm("Are you sure you want to save these changes?");
        if (!userConfirmed) {
            return; // Exit the function if the user cancels the prompt.
        }
    
        try {
            const token = localStorage.getItem('accessToken');
    
            // Save the task changes
            await axios.put(`/tasks/${taskId}`, editFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            // Update the task in the state
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === taskId
                        ? { ...task, ...editFormData }
                        : task
                )
            );
    
            // If status changed to "Completed", insert into points_history and leaderboard
            if (editFormData.status === "Completed") {
                const userId = 1; // Replace with the actual user ID
                const pointsEarned = 10; // Example points for completing a task
                const timestamp = new Date().toISOString();
    
                // Insert into points_history
                await axios.post('/gamification/update-points', {
                    user_id: userId,
                    action: "Task Completed",
                    points_earned: pointsEarned,
                    task_id: taskId,
                    task_title: editFormData.title,
                    timestamp: timestamp
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                // Insert or update leaderboard entry
                await axios.post('/gamification/update-leaderboard', {
                    user_id: userId,
                    task_id: taskId,
                    points_earned: pointsEarned,
                    task_title: editFormData.title,
                    timestamp: timestamp
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
    
            // Exit editing mode and show success message
            setEditingTask(null);
            setMessage('Task updated successfully!');
        } catch (error) {
            console.error('Error updating task:', error);
            setMessage('Error updating task!');
        }
    };
    



    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>User Dashboard</Typography>
            {userId && <Typography variant="h6">Welcome, User ID: {userId}</Typography>}
            
            {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
            
            {/* Gamification Stats Section */}
            {gamificationStats && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h5" gutterBottom>Gamification Stats</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Points</Typography>
                                    <Typography variant="body1">{gamificationStats.points}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Rank</Typography>
                                    <Typography variant="body1">{gamificationStats.rank}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Badges Earned</Typography>
                                    <Typography variant="body1">{gamificationStats.badges.join(', ') || 'No badges yet'}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* Tasks Section */}
            <Typography variant="h6" sx={{ mt: 3 }}>Tasks</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Task ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Progress Note</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks && tasks.length > 0 ? (
                            tasks.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell>{task.id}</TableCell>
                                    <TableCell>{task.title}</TableCell>
                                    <TableCell>{task.description}</TableCell>
                                    <TableCell>
                                        {editingTask === task.id ? (
                                            <TextField
                                                name="progress_note"
                                                value={editFormData.progress_note}
                                                onChange={handleEditChange}
                                                fullWidth
                                            />
                                        ) : (
                                            task.progress_note
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingTask === task.id ? (
                                            <FormControl fullWidth>
                                                <InputLabel>Status</InputLabel>
                                                <Select
                                                    name="status"
                                                    value={editFormData.status}
                                                    onChange={handleEditChange}
                                                >
                                                    <MenuItem value="Pending">Pending</MenuItem>
                                                    <MenuItem value="In Progress">In Progress</MenuItem>
                                                    <MenuItem value="Completed">Completed</MenuItem>
                                                </Select>
                                            </FormControl>
                                        ) : (
                                            task.status
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingTask === task.id ? (
                                            <Grid container spacing={1}>
                                                <Grid item>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleSaveClick(task.id)}
                                                    >
                                                        Save
                                                    </Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={handleCancelClick}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                onClick={() => handleEditClick(task)}
                                            >
                                                Edit
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No tasks found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UserDashboard;
