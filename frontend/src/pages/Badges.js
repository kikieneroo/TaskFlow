import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

const Badges = ({ accessToken }) => {
    const [badgesData, setBadgesData] = useState(null);

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const response = await axios.get('http://localhost:5000/admin-badges', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setBadgesData(response.data);
            } catch (error) {
                console.error('Error fetching badges:', error.message);
            }
        };

        fetchBadges();
    }, [accessToken]);

    return (
        <Container maxWidth="md" sx={{ marginTop: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Admin Badges
            </Typography>
            <Paper elevation={3} sx={{ padding: 3 }}>
                {badgesData ? (
                    <List>
                        {badgesData.badges.map((badge, index) => (
                            <ListItem key={index} divider>
                                <ListItemText primary={badge} />
                            </ListItem>
                        ))}
                        <Typography variant="h6" sx={{ marginTop: 2 }}>
                            Milestones Reached: {badgesData.milestones_reached}
                        </Typography>
                    </List>
                ) : (
                    <Typography>Loading badges...</Typography>
                )}
            </Paper>
        </Container>
    );
};

export default Badges;
