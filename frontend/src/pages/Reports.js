import React, { useEffect, useState } from 'react';
import { fetchTaskReport, fetchAIInsights, exportReport } from '../api';

const Reports = () => {
    const [taskReport, setTaskReport] = useState(null);
    const [insights, setInsights] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            const taskData = await fetchTaskReport();
            const insightsData = await fetchAIInsights();

            setTaskReport(taskData);
            setInsights(insightsData);
        };

        fetchReports();
    }, []);

    const handleExport = async () => {
        await exportReport();
        alert('Report exported successfully!');
    };

    return (
        <div>
            <h2>Reports</h2>
            {taskReport && (
                <div>
                    <h3>Task Report</h3>
                    <p>Total Tasks: {taskReport.totalTasks}</p>
                    <p>Completed Tasks: {taskReport.completedTasks}</p>
                    <p>In-Progress Tasks: {taskReport.inProgressTasks}</p>
                </div>
            )}
            {insights && (
                <div>
                    <h3>Insights</h3>
                    <p>{insights.insights}</p>
                </div>
            )}
            <button onClick={handleExport}>Export Report</button>
        </div>
    );
};

export default Reports;
