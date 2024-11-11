import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import ScrollableTabs from '../components/ScrollableTabs';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const mapResponsesToSurveyFormat = (userResponses, surveyFormat) => {
  const mappedResults = {};

  surveyFormat.pages.forEach((page) => {
    page.elements.forEach((element) => {
      const questionKey = element.name;
      const questionType = element.type;
      const questionTitle = element.title;

      // Only process matrix questions
      if (questionType === "matrix") {
        userResponses.forEach((response) => {
          const matrixAnswers = response[questionKey];
          mappedResults[questionTitle] = mappedResults[questionTitle] || {};

          element.rows.forEach((row) => {
            const rowKey = row.value;
            const selectedColumn = matrixAnswers[rowKey];
            if (selectedColumn) {
              mappedResults[questionTitle][row.text] = mappedResults[questionTitle][row.text] || {};
              mappedResults[questionTitle][row.text][selectedColumn] = 
                (mappedResults[questionTitle][row.text][selectedColumn] || 0) + 1;
            }
          });

          // Map column values to titles
          mappedResults[questionTitle].columnTitles = element.columns.reduce((acc, column) => {
            acc[column.value] = column.text;
            return acc;
          }, {});
        });
      }
    });
  });

  return mappedResults;
};

const Results = () => {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);
  const [mappedResponses, setMappedResponses] = useState({});

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const result1 = await axios.get(`https://surway-backend.onrender.com/api/projects/${id}/survey-responses`);
        const result2 = await axios.get(`https://surway-backend.onrender.com/api/projects/${id}/survey-results`);

        // Map each response to the survey format, only for matrix questions
        const allMappedResponses = mapResponsesToSurveyFormat(result1.data.map(response => response.response), result2.data);
        
        setMappedResponses(allMappedResponses);
      } catch (error) {
        console.error("Error fetching survey responses:", error);
      }
    };
    fetchResponses();
  }, [id]);

  const renderBarChart = (questionTitle, questionData) => {
    // Get labels as column titles
    const labels = Array.from(new Set(Object.keys(questionData.columnTitles))).map(
      key => questionData.columnTitles[key]
    );
    
    const datasets = Object.keys(questionData).filter(key => key !== 'columnTitles').map((rowTitle, index) => {
      const colors = [
        'rgba(255, 99, 71, 0.8)',     // Bright Red-Orange
        'rgba(30, 144, 255, 0.8)',    // Dodger Blue
        'rgba(60, 179, 113, 0.8)',    // Medium Sea Green
        'rgba(255, 215, 0, 0.8)',     // Gold
        'rgba(238, 130, 238, 0.8)',   // Violet
        'rgba(255, 105, 180, 0.8)',   // Hot Pink
        'rgba(0, 191, 255, 0.8)',     // Deep Sky Blue
        'rgba(255, 165, 0, 0.8)',     // Orange
        'rgba(50, 205, 50, 0.8)',     // Lime Green
        'rgba(220, 20, 60, 0.8)'      // Crimson
      ];
      
      
      return {
        label: rowTitle,
        data: labels.map(label => questionData[rowTitle][Object.keys(questionData.columnTitles).find(key => questionData.columnTitles[key] === label)] || 0),
        // backgroundColor: `rgba(${index * 50}, ${100 + index * 50}, 200, 0.5)`,
        // borderColor: `rgba(${index * 50}, ${100 + index * 50}, 200, 1)`,
        backgroundColor: colors[index % colors.length], // Cycle through colors
        borderColor: colors[index % colors.length].replace('0.5', '1'), // Set full opacity for border
        borderWidth: 1,
        barThickness: 20, // Adjusts the bar thickness
      };
    });

    const data = {
      labels,
      datasets,
    };

    return (
      <Box sx={{ width: '80%', height: '50vh', margin: 'auto' }}>
        <Bar 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top' },
              // title: { display: true, text: questionTitle },
            },
            scales: {
              x: {
                ticks: { maxRotation: 0, minRotation: 0 },
              },
              y: {
                beginAtZero: true,
              },
            },
          }}
          data={data}
        />
      </Box>
    );
  };

  return (
    <Box>
      <ScrollableTabs />      
      <div>
        {Object.keys(mappedResponses).map((questionTitle, index) => (
          <Box key={index} sx={{ mb: 4, pl: 4, pt:4 }}>
            <Typography variant="h6" gutterBottom>
              {`Q${index + 1}. ${questionTitle}`}
            </Typography>
            {renderBarChart(questionTitle, mappedResponses[questionTitle])}
          </Box>
        ))}
      </div>
    </Box>
  );
};

export default Results;
