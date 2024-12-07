import React, { useState, useEffect } from 'react';
import axios from '../api';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    TextField,
    Select,
    MenuItem,
    Paper,
    Typography,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: '' });

    // Fetch users from the API
    const fetchUsers = async () => {
        try {
            const response = await axios.get('/users', {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            });
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error.response?.data || error.message);
        }
    };

    // Handle Edit
    const handleEdit = (user) => {
        setSelectedUser(user);
        setFormData({ name: user.name, email: user.email, role: user.role });
    };

    // Handle Update
    const handleUpdate = async () => {
        try {
            await axios.put(
                `/users/${selectedUser.id}`,
                { ...formData },
                { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
            );
            alert('User updated successfully');
            setSelectedUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error.response?.data || error.message);
        }
    };

    // Handle Delete
    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                console.log('Attempting to delete user with ID:', userId);
                const response = await axios.delete(`/users/${userId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                });
                console.log('Delete response:', response);
                alert('User deleted successfully');
                fetchUsers(); // Refresh the list after deletion
            } catch (error) {
                console.error('Error deleting user:', error.response?.data || error.message);
                alert('Failed to delete user. Please try again later.');
            }
        }
    };


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <Box padding={2}>
            <Typography variant="h4" gutterBottom>
                User List
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleEdit(user)}
                                        sx={{ marginRight: 1 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit User Dialog */}
            {selectedUser && (
                <Dialog open={true} onClose={() => setSelectedUser(null)}>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            margin="dense"
                        />
                        <TextField
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            margin="dense"
                        />
                        <Select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            fullWidth
                            margin="dense"
                            displayEmpty
                        >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSelectedUser(null)} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate} color="primary">
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default UserList;
