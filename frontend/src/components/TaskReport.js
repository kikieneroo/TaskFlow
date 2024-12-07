import React, { useState, useEffect } from 'react';
import { fetchTaskReport } from '../api';

const TaskReport = () => {
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await fetchTaskReport();
        setReportData(data);
      } catch (err) {
        setError(err.message);
      }
    };
    loadReport();
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!reportData.length) return <p>Loading...</p>;

  return (
    <div>
      <h2>Task Report</h2>
      <ul>
        {reportData.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong>: {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskReport;
