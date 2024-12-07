import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    Box
} from '@mui/material';

const PointsHistory = () => {
    const [pointsHistory, setPointsHistory] = useState([]);

    useEffect(() => {
        // Fetching points history data from the server
        axios.get('http://localhost:5000/gamification/points-history', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then((response) => {
            setPointsHistory(response.data);
        })
        .catch((err) => {
            console.error("Error fetching points history", err);
        });
    }, []);

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Points History
            </Typography>
            {pointsHistory.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>User ID</strong></TableCell>
                                <TableCell><strong>Action</strong></TableCell>
                                <TableCell><strong>Points Earned</strong></TableCell>
                                <TableCell><strong>Task ID</strong></TableCell>
                                <TableCell><strong>Task Title</strong></TableCell>
                                <TableCell><strong>Timestamp</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pointsHistory.map((entry) => (
                                <TableRow key={entry.task_id}>
                                    <TableCell>{entry.user_id}</TableCell>
                                    <TableCell>{entry.action}</TableCell>
                                    <TableCell>{entry.points_earned}</TableCell>
                                    <TableCell>{entry.task_id}</TableCell>
                                    <TableCell>{entry.task_title}</TableCell>
                                    <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Box textAlign="center" mt={4}>
                    <Typography variant="h6" color="textSecondary">
                        No data available
                    </Typography>
                </Box>
            )}
        </div>
    );
};

export default PointsHistory;
