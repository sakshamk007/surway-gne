import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { Bar, Pie, Line } from 'react-chartjs-2';
import ScrollableTabs from '../components/ScrollableTabs';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const mapResponsesToSurveyFormat = (userResponses, surveyFormat) => {
  const mappedResults = {};

  surveyFormat.pages.forEach((page) => {
    if (!page.elements) return;

    page.elements.forEach((element) => {
      const questionKey = element.name;
      const questionType = element.type;
      const questionTitle = element.title;

      mappedResults[questionTitle] = {
        type: questionType,
        data: {}
      };

      switch (questionType) {
        case 'radiogroup':
        case 'dropdown':
          // Single choice questions
          element.choices.forEach(choice => {
            mappedResults[questionTitle].data[choice.text] = 0;
          });
          userResponses.forEach(response => {
            const answer = response[questionKey];
            const choiceText = element.choices.find(c => c.value === answer)?.text;
            if (choiceText) {
              mappedResults[questionTitle].data[choiceText]++;
            }
          });
          break;

        case 'checkbox':
        case 'tagbox':
          // Multiple choice questions
          element.choices.forEach(choice => {
            mappedResults[questionTitle].data[choice.text] = 0;
          });
          userResponses.forEach(response => {
            const answers = response[questionKey] || [];
            answers.forEach(answer => {
              const choiceText = element.choices.find(c => c.value === answer)?.text;
              if (choiceText) {
                mappedResults[questionTitle].data[choiceText]++;
              }
            });
          });
          break;

        case 'rating':
          // Rating questions
          for (let i = 1; i <= 5; i++) {
            mappedResults[questionTitle].data[i] = 0;
          }
          userResponses.forEach(response => {
            const rating = response[questionKey];
            if (rating) {
              mappedResults[questionTitle].data[rating.$numberInt || rating]++;
            }
          });
          break;

        case 'boolean':
          // Yes/No questions
          mappedResults[questionTitle].data = { 'Yes': 0, 'No': 0 };
          userResponses.forEach(response => {
            const answer = response[questionKey];
            if (answer !== undefined) {
              mappedResults[questionTitle].data[answer ? 'Yes' : 'No']++;
            }
          });
          break;

        case 'matrix':
          // Simple matrix questions
          mappedResults[questionTitle].data = {};
          mappedResults[questionTitle].columnTitles = element.columns.reduce((acc, column) => {
            acc[column.value] = column.text;
            return acc;
          }, {});

          element.rows.forEach(row => {
            mappedResults[questionTitle].data[row.text] = {};
            element.columns.forEach(column => {
              mappedResults[questionTitle].data[row.text][column.value] = 0;
            });
          });

          userResponses.forEach(response => {
            const matrixAnswers = response[questionKey];
            if (matrixAnswers) {
              Object.entries(matrixAnswers).forEach(([rowKey, colValue]) => {
                const rowText = element.rows.find(r => r.value === rowKey)?.text;
                if (rowText && mappedResults[questionTitle].data[rowText]) {
                  mappedResults[questionTitle].data[rowText][colValue] =
                    (mappedResults[questionTitle].data[rowText][colValue] || 0) + 1;
                }
              });
            }
          });
          break;

        case 'matrixdropdown':
          // Matrix dropdown questions
          mappedResults[questionTitle].data = {};
          mappedResults[questionTitle].columnTitles = element.columns.reduce((acc, column) => {
            acc[column.name] = column.title;
            return acc;
          }, {});

          element.rows.forEach(row => {
            mappedResults[questionTitle].data[row.text] = {};
            element.columns.forEach(column => {
              mappedResults[questionTitle].data[row.text][column.name] = {
                values: Array(6).fill(0) // For values 1-5
              };
            });
          });

          userResponses.forEach(response => {
            const matrixAnswers = response[questionKey];
            if (matrixAnswers) {
              Object.entries(matrixAnswers).forEach(([rowKey, colValues]) => {
                const rowText = element.rows.find(r => r.value === rowKey)?.text;
                if (rowText) {
                  Object.entries(colValues).forEach(([colKey, value]) => {
                    const numValue = parseInt(value.$numberInt || value);
                    if (!isNaN(numValue)) {
                      mappedResults[questionTitle].data[rowText][colKey].values[numValue]++;
                    }
                  });
                }
              });
            }
          });
          break;

        case 'matrixdynamic':
          // Dynamic matrix questions
          mappedResults[questionTitle].data = {};
          mappedResults[questionTitle].columnTitles = element.columns.reduce((acc, column) => {
            acc[column.name] = column.title;
            return acc;
          }, {});

          element.columns.forEach(column => {
            mappedResults[questionTitle].data[column.title] = {
              values: Array(6).fill(0) // For values 1-5
            };
          });

          userResponses.forEach(response => {
            const matrixAnswers = response[questionKey] || [];
            matrixAnswers.forEach(row => {
              Object.entries(row).forEach(([colKey, value]) => {
                const colTitle = element.columns.find(c => c.name === colKey)?.title;
                if (colTitle) {
                  const numValue = parseInt(value.$numberInt || value);
                  if (!isNaN(numValue)) {
                    mappedResults[questionTitle].data[colTitle].values[numValue]++;
                  }
                }
              });
            });
          });
          break;
      }
    });
  });

  return mappedResults;
};

const getChartColors = (index) => {
  const colors = [
    'rgba(255, 99, 71, 0.8)',
    'rgba(30, 144, 255, 0.8)',
    'rgba(60, 179, 113, 0.8)',
    'rgba(255, 215, 0, 0.8)',
    'rgba(238, 130, 238, 0.8)',
    'rgba(255, 105, 180, 0.8)',
    'rgba(0, 191, 255, 0.8)',
    'rgba(255, 165, 0, 0.8)',
    'rgba(50, 205, 50, 0.8)',
    'rgba(220, 20, 60, 0.8)'
  ];
  return colors[index % colors.length];
};

const renderChart = (questionTitle, questionData) => {
  const { type, data } = questionData;

  switch (type) {
    case 'radiogroup':
    case 'dropdown':
    case 'checkbox':
    case 'tagbox':
    case 'boolean':
      // Pie chart for single/multiple choice questions
      const pieData = {
        labels: Object.keys(data),
        datasets: [{
          data: Object.values(data),
          backgroundColor: Object.keys(data).map((_, i) => getChartColors(i)),
          borderWidth: 1
        }]
      };

      return (
        <Box sx={{ width: '50%', height: '300px', margin: 'auto' }}>
          <Pie
            data={pieData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'right' }
              }
            }}
          />
        </Box>
      );

    case 'rating':
      // Bar chart for rating questions
      const ratingData = {
        labels: Object.keys(data),
        datasets: [{
          label: 'Number of responses',
          data: Object.values(data),
          backgroundColor: getChartColors(0),
          borderColor: getChartColors(0).replace('0.8', '1'),
          borderWidth: 1,
          barThickness: 30,
        }]
      };

      return (
        <Box sx={{ width: '80%', height: '400px', margin: 'auto' }}>
          <Bar
            data={ratingData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: { beginAtZero: true }
              }
            }}
          />
        </Box>
      );

    case 'matrix':
      // Bar chart for matrix questions
      const labels = Array.from(new Set(Object.keys(questionData.columnTitles))).map(
        key => questionData.columnTitles[key]
      );

      const datasets = Object.keys(data).map((rowTitle, index) => ({
        label: rowTitle,
        data: labels.map(label => {
          const colKey = Object.keys(questionData.columnTitles)
            .find(key => questionData.columnTitles[key] === label);
          return data[rowTitle][colKey] || 0;
        }),
        backgroundColor: getChartColors(index),
        borderColor: getChartColors(index).replace('0.8', '1'),
        borderWidth: 1,
        barThickness: 30,
      }));

      return (
        <Box sx={{ width: '80%', height: '400px', margin: 'auto' }}>
          <Bar
            data={{ labels, datasets }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' }
              },
              scales: {
                x: {
                  ticks: { maxRotation: 0, minRotation: 0 }
                },
                y: { beginAtZero: true }
              }
            }}
          />
        </Box>
      );

    case 'matrixdropdown':
    case 'matrixdynamic':
      // Stacked bar chart for matrix dropdown and dynamic matrix
      const matrixLabels = Object.keys(data);
      const valueLabels = ['1', '2', '3', '4', '5'];

      const matrixDatasets = valueLabels.map((value, index) => ({
        label: `Rating ${value}`,
        data: matrixLabels.map(label => {
          if (type === 'matrixdropdown') {
            return Object.values(data[label]).reduce((sum, col) =>
              sum + (col.values[parseInt(value)] || 0), 0);
          } else {
            return data[label].values[parseInt(value)] || 0;
          }
        }),
        backgroundColor: getChartColors(index),
        borderColor: getChartColors(index).replace('0.8', '1'),
        borderWidth: 1,
        stack: 'stack1',
      }));

      return (
        <Box sx={{ width: '80%', height: '400px', margin: 'auto' }}>
          <Bar
            data={{
              labels: matrixLabels,
              datasets: matrixDatasets
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' }
              },
              scales: {
                x: {
                  ticks: { maxRotation: 0, minRotation: 0 }
                },
                y: {
                  beginAtZero: true,
                  stacked: true
                }
              }
            }}
          />
        </Box>
      );

    default:
      return null;
  }
};

const Results = () => {
  const { id } = useParams();
  const [mappedResponses, setMappedResponses] = useState({});
  const [projectDetails, setProjectDetails] = useState({});

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const result1 = await axios.get(`https://surway-backend.onrender.com/api/projects/${id}/survey-responses`);
        const result2 = await axios.get(`https://surway-backend.onrender.com/api/projects/${id}/survey-results`);
        const projectDetailsResponse = await axios.get(`https://surway-backend.onrender.com/api/projects/${id}`);

        // Set project details for PDF
        setProjectDetails(projectDetailsResponse.data);

        const allMappedResponses = mapResponsesToSurveyFormat(
          result1.data.map(response => response.response),
          result2.data
        );
        setMappedResponses(allMappedResponses);
      } catch (error) {
        console.error("Error fetching survey responses:", error);
      }
    };
    fetchResponses();
  }, [id]);

  const handleExportPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size
    const content = document.getElementById('results-content'); // Content to export

    const canvas = await html2canvas(content, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Add project details
    pdf.setFontSize(12);
    pdf.text(`Project ID: ${projectDetails._id}`, 10, 10);
    pdf.text(`Project Name: ${projectDetails.name || ''}`, 10, 20);

    // Add content image to the PDF
    let yPosition = 50;
    if (pdfHeight > pdf.internal.pageSize.getHeight() - yPosition) {
      pdf.addPage(); // Add a new page if the image is too large
      yPosition = 10; // Reset y position for the new page
    }
    pdf.addImage(imgData, 'PNG', 10, yPosition, pdfWidth - 20, pdfHeight);

    // Save the PDF
    pdf.save(`${projectDetails.name || 'Survey_Results'}.pdf`);
  };


  return (
    <Box>
      <ScrollableTabs />
       <Button
        onClick={handleExportPDF}
        variant="contained"
        sx={{
          backgroundColor: '#a1dac8',
          color: 'black',
          margin: '10px',
          alignSelf: 'flex-end',
        }}
      >
        Export as PDF
      </Button>
      <div id="results-content">
        {Object.entries(mappedResponses).map(([questionTitle, questionData], index) => (
          <Box key={index} sx={{ mb: 4, pl: 4, pt: 4 }}>
            <Typography variant="h6" gutterBottom>
              {`Q${index + 1}. ${questionTitle}`}
            </Typography>
            {renderChart(questionTitle, questionData)}
          </Box>
        ))}
      </div>
    </Box>
  );
};

export default Results;