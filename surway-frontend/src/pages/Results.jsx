import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import ScrollableTabs from '../components/ScrollableTabs';
import axios from 'axios';

const mapResponsesToSurveyFormat = (responseData, surveyFormat) => {
  const mappedResults = {};

  // Extract the response object (assuming there's only one response here)
  const userResponse = responseData[0].response;
  console.log(userResponse);

  // Loop through each page and its elements in the survey format
  surveyFormat.pages.forEach((page) => {
    page.elements.forEach((element) => {
      const questionKey = element.name;
      const questionType = element.type;
      const questionTitle = element.title;

      // Map the response based on the question type
      if (questionType === "text") {
        // Directly map text responses
        mappedResults[questionTitle] = userResponse[questionKey];
      } else if (questionType === "dropdown") {
        // Map dropdown responses by finding the choice text
        const selectedValue = userResponse[questionKey];
        const choiceText = element.choices.find(choice => choice.value === selectedValue)?.text;
        mappedResults[questionTitle] = choiceText || "N/A";
      } else if (questionType === "matrix") {
        // Map matrix responses
        const matrixAnswers = userResponse[questionKey];
        const formattedMatrix = {};

        element.rows.forEach((row) => {
          const rowKey = row.value;
          const selectedColumn = matrixAnswers[rowKey];
          const columnText = element.columns.find(column => column.value === selectedColumn)?.text;
          formattedMatrix[row.text] = columnText || "N/A";
        });

        mappedResults[questionTitle] = formattedMatrix;
      }
    });
  });

  return mappedResults;
};

const Results = () => {
  const { id } = useParams();  // Get project ID from the URL
  const [responses, setResponses] = useState([]);
  const [mappedResponses, setMappedResponses] = useState(null);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const result1 = await axios.get(`http://localhost:8000/api/projects/${id}/survey-responses`);
        const result2 = await axios.get(`http://localhost:8000/api/projects/${id}/survey-results`);
        console.log(result1.data);
        console.log(result2.data);

        // Assuming data contains `responses` and `surveyResults` fields
        const simplifiedData = mapResponsesToSurveyFormat(result1.data, result2.data);
        setMappedResponses(simplifiedData);
      } catch (error) {
        console.error("Error fetching survey responses:", error);
      }
    };
    fetchResponses();
  }, [id]);

  return (
    <Box>
      <ScrollableTabs />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4">
          Results for Project ID: {id}
        </Typography>
      </Box>
      <div>
        <h2>Survey Responses</h2>
        <ul>
          {mappedResponses &&
            Object.keys(mappedResponses).map((question, index) => (
              <li key={index}>
                <strong>{question}:</strong>{" "}
                {typeof mappedResponses[question] === "object"
                  ? JSON.stringify(mappedResponses[question])
                  : mappedResponses[question]}
              </li>
            ))}
        </ul>
      </div>
    </Box>
  );
};

export default Results;
