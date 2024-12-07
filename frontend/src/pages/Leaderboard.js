import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch leaderboard data
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('/gamification/leaderboard'); // Adjust endpoint if necessary
                setLeaderboardData(response.data);
            } catch (err) {
                console.error('Error fetching leaderboard:', err);
                setError('Failed to fetch leaderboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return <div>Loading leaderboard...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Leaderboard</h2>
            {leaderboardData.length === 0 ? (
                <div>No data available</div>
            ) : (
                <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>User ID</th>
                            <th>Username</th>
                            <th>Total Points</th>
                            <th>Level</th>
                            <th>Badges</th>
                            <th>Achievements</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardData.map((row, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{row.user_id}</td>
                                <td>{row.username}</td>
                                <td>{row.total_points}</td>
                                <td>{row.level || 'N/A'}</td>
                                <td>{row.badges || 'N/A'}</td>
                                <td>{row.achievements || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Leaderboard;
