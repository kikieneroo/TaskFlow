import React, { useEffect, useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    Pagination,
    TextField,
    InputAdornment,
  //  Button,
    Grid,
    IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';

const AdminDashboard = () => {
    const [tasks, setTasks] = useState([]); // State to store all tasks
    const [leaderboard, setLeaderboard] = useState([]); // State to store leaderboard data
    const [message, setMessage] = useState(''); // State for error/success messages
    const [searchTerm, setSearchTerm] = useState(''); // State for search input
    const [taskPage, setTaskPage] = useState(1);
    const [leaderboardPage, setLeaderboardPage] = useState(1);
    const tasksPerPage = 5;
    const leaderboardPerPage = 5;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    navigate('/login');
                    return;
                }

                // Fetch tasks
                const tasksResponse = await axios.get('/tasks', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTasks(tasksResponse.data);

                // Fetch leaderboard data
                const leaderboardResponse = await axios.get('/gamification/leaderboard', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const leaderboardData = Array.isArray(leaderboardResponse.data) ? leaderboardResponse.data : [];
                setLeaderboard(leaderboardData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setMessage('Error fetching data. Please try again.');
            }
        };

        fetchAdminData();
    }, [navigate]);

    // Filtered tasks based on search term
    const filteredTasks = tasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginated tasks and leaderboard
    const displayedTasks = filteredTasks.slice((taskPage - 1) * tasksPerPage, taskPage * tasksPerPage);
    const displayedLeaderboard = leaderboard.slice((leaderboardPage - 1) * leaderboardPerPage, leaderboardPage * leaderboardPerPage);

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
            
            {message && <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>}

            {/* Search Section */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Search Tasks"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6} textAlign="right">
                    <IconButton onClick={() => window.location.reload()}>
                        <RefreshIcon />
                    </IconButton>
                </Grid>
            </Grid>

            {/* Tasks Section */}
            <Typography variant="h6" sx={{ mt: 3 }}>All Tasks</Typography>
            <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Task ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Progress Note</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Assigned To</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Created By</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedTasks && displayedTasks.length > 0 ? (
                            displayedTasks.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell>{task.id}</TableCell>
                                    <TableCell>{task.title}</TableCell>
                                    <TableCell>{task.description}</TableCell>
                                    <TableCell>{task.progress_note}</TableCell>
                                    <TableCell>{task.status}</TableCell>
                                    <TableCell>{task.assigned_to}</TableCell>
                                    <TableCell>{task.created_by}</TableCell>
                                    <TableCell>{task.due_date}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">No tasks found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Pagination
                count={Math.ceil(filteredTasks.length / tasksPerPage)}
                page={taskPage}
                onChange={(e, page) => setTaskPage(page)}
                sx={{ mb: 4 }}
            />

            {/* Leaderboard Section */}
            <Typography variant="h6" sx={{ mt: 3 }}>Leaderboard</Typography>
            <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User ID</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Total Points</TableCell>
                            <TableCell>Level</TableCell>
                            <TableCell>Badges</TableCell>
                            <TableCell>Achievements</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedLeaderboard && displayedLeaderboard.length > 0 ? (
                            displayedLeaderboard.map((entry) => (
                                <TableRow key={entry.user_id}>
                                    <TableCell>{entry.user_id}</TableCell>
                                    <TableCell>{entry.username}</TableCell>
                                    <TableCell>{entry.total_points}</TableCell>
                                    <TableCell>{entry.level}</TableCell>
                                    <TableCell>{entry.badges.join(', ') || 'No badges'}</TableCell>
                                    <TableCell>{entry.achievements.join(', ') || 'No achievements'}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No leaderboard data found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Pagination
                count={Math.ceil(leaderboard.length / leaderboardPerPage)}
                page={leaderboardPage}
                onChange={(e, page) => setLeaderboardPage(page)}
                sx={{ mb: 4 }}
            />
        </Box>
    );
};

export default AdminDashboard;
