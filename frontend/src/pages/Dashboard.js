import React, { useState } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const Dashboard = () => {
    const [refresh, setRefresh] = useState(false);

    const handleTaskCreated = () => {
        setRefresh((prev) => !prev); // Trigger task list refresh
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <TaskForm onTaskCreated={handleTaskCreated} />
            <TaskList key={refresh} />
        </div>
    );
};

export default Dashboard;
