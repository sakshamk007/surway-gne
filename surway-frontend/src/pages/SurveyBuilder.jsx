import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import axios from "axios"; // Import axios for API requests
import { useParams } from "react-router-dom"; // to capture the project ID from URL
import "survey-core/defaultV2.css";
import "survey-creator-core/survey-creator-core.css";

const SurveyBuilder = () => {
  const { id } = useParams(); // Capture project ID from URL
  const [creator, setCreator] = useState(null);

  useEffect(() => {
    // Function to fetch survey data from backend
    const fetchSurveyData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/projects/${id}`);
        const project = response.data;
        const surveyData = project.surveyResults; // This is where your survey JSON is stored

        initializeSurveyCreator(surveyData); // Initialize SurveyCreator with fetched survey data
      } catch (err) {
        console.error("Failed to load project data", err);
      }
    };

    // Initialize the Survey Creator
    const initializeSurveyCreator = (surveyData = { questions: [] }) => {
      const creatorOptions = {
        showLogicTab: true,
        isAutoSave: true,
      };

      const newCreator = new SurveyCreator(creatorOptions);

      // Set the initial JSON in the Survey Creator
      newCreator.JSON = surveyData;

      // Add event listener to handle auto-save or manual save
      newCreator.saveSurveyFunc = async (saveNo, callback) => {
        const surveyJSON = newCreator.JSON; // Get the current survey JSON
        await saveSurveyToDB(surveyJSON); // Save to DB whenever survey is saved
        callback(saveNo, true); // Indicate that the save was successful
      };

      setCreator(newCreator);
    };

    // Fetch survey data when component mounts
    fetchSurveyData();
  }, [id]);

  // Function to save survey JSON to backend
  const saveSurveyToDB = async (surveyJSON) => {
    try {
      await axios.post(`http://localhost:8000/api/projects/${id}/save-survey`, {
        surveyJSON, // Send the survey JSON
      });
      console.log("Survey JSON saved successfully");
    } catch (err) {
      console.error("Failed to save survey", err);
    }
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)", // Adjust for the Navbar height (assuming 64px)
        width: "100vw",               // Full width
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        overflow: "hidden",           // Prevent content from going out of bounds
        padding: 0,
        margin: 0,
        boxSizing: "border-box",
      }}
    >
      {/* SurveyJS Creator Integration */}
      {creator && (
        <Box sx={{ width: "100%", height: "100%", overflow: "auto" }}>
          <SurveyCreatorComponent creator={creator} />
        </Box>
      )}
    </Box>
  );
};

export default SurveyBuilder;