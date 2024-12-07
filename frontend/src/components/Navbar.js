import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
    const { isAuthenticated, userRole, logout } = useAuth();
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = () => {
        logout();
        localStorage.clear(); // Clear token and other sensitive data
        sessionStorage.clear();
        navigate('/'); // Redirect to "/" after logout
    };

    const handleHomeClick = () => {
        if (!isAuthenticated) {
            navigate('/'); // Redirect to "/" if not authenticated
        }
    };

    const toggleDrawer = (open) => {
        setDrawerOpen(open);
    };

    const navLinks = (
        <>
            {isAuthenticated ? (
                <>
                    {userRole === 'admin' && (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button component={Link} to="/admin/tasks" color="inherit">
                                View Tasks
                            </Button>
                            <Button component={Link} to="/admin/create-task" color="inherit">
                                Create Task
                            </Button>
                            <Button component={Link} to="/admin/users" color="inherit">
                                View Users
                            </Button>
                            <Button component={Link} to="/admin/add-user" color="inherit">
                                Add Users
                            </Button>
                            <Button component={Link} to="/task-report" color="inherit">
                                Task Report
                            </Button>
                            <Button component={Link} to="/admin/leaderboard" color="inherit">
                                Leaderboard
                            </Button>
                            <Button component={Link} to="/admin/points-history" color="inherit">
                                Points History
                            </Button>
                        </Box>
                    )}
                    {userRole === 'user' && (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button component={Link} to="/user" color="inherit">
                                My Tasks
                            </Button>
                            <Button component={Link} to="/user/leaderboard" color="inherit">
                                Leaderboard
                            </Button>
                            <Button component={Link} to="/user/badges" color="inherit">
                                My Badges
                            </Button>
                        </Box>
                    )}
                    <Button onClick={handleLogout} color="inherit" sx={{ marginLeft: 'auto' }}>
                        Logout
                    </Button>
                </>
            ) : (
                <Button component={Link} to="/login" color="inherit">
                    Login
                </Button>
            )}
        </>
    );

    const drawerContent = (
        <Box sx={{ width: 250 }}>
            <List>
                <ListItem button component={Link} to="/" onClick={() => toggleDrawer(false)}>
                    <ListItemText primary="Home" />
                </ListItem>
                {isAuthenticated && (
                    <>
                        {userRole === 'admin' && (
                            <>
                                <ListItem button component={Link} to="/admin/tasks" onClick={() => toggleDrawer(false)}>
                                    <ListItemText primary="View Tasks" />
                                </ListItem>
                                <ListItem button component={Link} to="/admin/create-task" onClick={() => toggleDrawer(false)}>
                                    <ListItemText primary="Create Task" />
                                </ListItem>
                                <ListItem button component={Link} to="/admin/users" onClick={() => toggleDrawer(false)}>
                                    <ListItemText primary="View Users" />
                                </ListItem>
                                <ListItem button component={Link} to="/admin/task-report" onClick={() => toggleDrawer(false)}>
                                    <ListItemText primary="Task Report" />
                                </ListItem>
                                <ListItem button component={Link} to="/leaderboard" onClick={() => toggleDrawer(false)}>
                                    <ListItemText primary="Leaderboard" />
                                </ListItem>
                            </>
                        )}
                        {userRole === 'user' && (
                            <>
                                <ListItem button component={Link} to="/user" onClick={() => toggleDrawer(false)}>
                                    <ListItemText primary="My Tasks" />
                                </ListItem>
                                <ListItem button component={Link} to="/user/leaderboard" onClick={() => toggleDrawer(false)}>
                                    <ListItemText primary="Leaderboard" />
                                </ListItem>
                                <ListItem button component={Link} to="/user/badges" onClick={() => toggleDrawer(false)}>
                                    <ListItemText primary="My Badges" />
                                </ListItem>
                            </>
                        )}
                        <ListItem button onClick={() => { handleLogout(); toggleDrawer(false); }}>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </>
                )}
                {!isAuthenticated && (
                    <ListItem button component={Link} to="/login" onClick={() => toggleDrawer(false)}>
                        <ListItemText primary="Login" />
                    </ListItem>
                )}
            </List>
        </Box>
    );

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => toggleDrawer(true)} sx={{ display: { sm: 'none', xs: 'block' } }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Button
                        component={Link}
                        to={isAuthenticated ? (userRole === 'admin' ? "/admin" : "/user") : "/"}
                        color="inherit"
                        onClick={handleHomeClick}
                    >
                        Home
                    </Button>
                </Typography>

                {/* Desktop Navbar */}
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
                    {navLinks}
                </Box>
            </Toolbar>

            {/* Drawer for mobile */}
            <Drawer anchor="left" open={drawerOpen} onClose={() => toggleDrawer(false)}>
                {drawerContent}
            </Drawer>
        </AppBar>
    );
};

export default Navbar;
