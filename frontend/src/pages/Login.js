import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api'; // Assume axios is pre-configured
import { 
    Box, 
    Button, 
    TextField, 
    Typography, 
    Alert, 
    Container 
} from '@mui/material';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/login', formData);
            const { accessToken, role, userId } = response.data;

            // Store tokens, userId, and role in localStorage
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('userId', userId); // Save userId
            localStorage.setItem('userRole', role); // Save role

            login(role); // Set auth state
            navigate(role === 'admin' ? '/admin' : `/user`); // Use userId in path if necessary
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <Container maxWidth="xs">
            {/* Project Title Outside the Login Box */}
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
                TASKFLOW SYSTEM
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 8,
                    p: 3,
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                {/* Login Form Heading */}
                <Typography variant="h5" component="h1" gutterBottom>
                    Login
                </Typography>

                {message && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                        {message}
                    </Alert>
                )}
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <TextField
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default Login;
