import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper } from '@mui/material';

const Home = () => (
    <Container maxWidth="sm" sx={{ textAlign: 'center', marginTop: 8 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
                Welcome to TaskFlow
            </Typography>
            <Typography variant="body1" gutterBottom>
                Manage your tasks efficiently with TaskFlow!
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 3 }}>
                <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    color="primary"
                    size="large"
                >
                    Login
                </Button>                
            </Box>
        </Paper>
    </Container>
);

export default Home;
