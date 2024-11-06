// import React, { useState, useEffect } from "react";
// import { Box } from "@mui/material";
// import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
// import axios from "axios"; // Import axios for API requests
// import { useParams } from "react-router-dom"; // to capture the project ID from URL
// import "survey-core/defaultV2.css";
// import "survey-creator-core/survey-creator-core.css";

// const SurveyBuilder = () => {
//   const { id } = useParams(); // Capture project ID from URL
//   const [creator, setCreator] = useState(null);

//   useEffect(() => {
//     // Function to fetch survey data from backend
//     const fetchSurveyData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8000/api/projects/${id}`);
//         const project = response.data;
//         const surveyData = project.surveyResults; // This is where your survey JSON is stored

//         initializeSurveyCreator(surveyData); // Initialize SurveyCreator with fetched survey data
//       } catch (err) {
//         console.error("Failed to load project data", err);
//       }
//     };

//     // Initialize the Survey Creator
//     const initializeSurveyCreator = (surveyData = { questions: [] }) => {
//       const creatorOptions = {
//         showLogicTab: true,
//         isAutoSave: true,
//       };

//       const newCreator = new SurveyCreator(creatorOptions);

//       // Set the initial JSON in the Survey Creator
//       newCreator.JSON = surveyData;

//       // Add event listener to handle auto-save or manual save
//       newCreator.saveSurveyFunc = async (saveNo, callback) => {
//         const surveyJSON = newCreator.JSON; // Get the current survey JSON
//         await saveSurveyToDB(surveyJSON); // Save to DB whenever survey is saved
//         callback(saveNo, true); // Indicate that the save was successful
//       };

//       setCreator(newCreator);
//     };

//     // Fetch survey data when component mounts
//     fetchSurveyData();
//   }, [id]);

//   // Function to save survey JSON to backend
//   const saveSurveyToDB = async (surveyJSON) => {
//     try {
//       await axios.post(`http://localhost:8000/api/projects/${id}/save-survey`, {
//         surveyJSON, // Send the survey JSON
//       });
//       console.log("Survey JSON saved successfully");
//     } catch (err) {
//       console.error("Failed to save survey", err);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         height: "calc(100vh - 64px)", // Adjust for the Navbar height (assuming 64px)
//         width: "100vw",               // Full width
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "flex-start",
//         overflow: "hidden",           // Prevent content from going out of bounds
//         padding: 0,
//         margin: 0,
//         boxSizing: "border-box",
//       }}
//     >
//       {/* SurveyJS Creator Integration */}
//       {creator && (
//         <Box sx={{ width: "100%", height: "100%", overflow: "auto" }}>
//           <SurveyCreatorComponent creator={creator} />
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default SurveyBuilder;

import React, { useState, useEffect } from "react";
import { Box, Button, Modal, Typography, TextField, IconButton } from "@mui/material";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy"; // For copy icon
import "survey-core/defaultV2.css";
import "survey-creator-core/survey-creator-core.css";

const SurveyBuilder = () => {
  const { id } = useParams();
  const [creator, setCreator] = useState(null);
  const [open, setOpen] = useState(false);
  const [publicLink, setPublicLink] = useState("");

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/projects/${id}`);
        const project = response.data;
        const surveyData = project.surveyResults;
        initializeSurveyCreator(surveyData);
      } catch (err) {
        console.error("Failed to load project data", err);
      }
    };

    const initializeSurveyCreator = (surveyData = { questions: [] }) => {
      const creatorOptions = {
        showLogicTab: true,
        isAutoSave: true,
      };

      const newCreator = new SurveyCreator(creatorOptions);
      newCreator.JSON = surveyData;

      newCreator.saveSurveyFunc = async (saveNo, callback) => {
        const surveyJSON = newCreator.JSON;
        await saveSurveyToDB(surveyJSON);
        callback(saveNo, true);
      };

      setCreator(newCreator);
    };

    fetchSurveyData();
  }, [id]);

  const saveSurveyToDB = async (surveyJSON) => {
    try {
      await axios.post(`http://localhost:8000/api/projects/${id}/save-survey`, { surveyJSON });
      console.log("Survey JSON saved successfully");
    } catch (err) {
      console.error("Failed to save survey", err);
    }
  };

  const handlePublish = async () => {
    
    try {
      const response = await axios.post(`http://localhost:8000/api/projects/${id}/publish`);
      setPublicLink(response.data.publicLink);
      setOpen(true);
    } catch (err) {
      console.error("Error publishing survey", err);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicLink);
    alert("Link copied to clipboard!");
  };

  return (
    <>
      {/* Navbar-like container */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f8f9fa", // Light background
          padding: "16px 24px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Typography variant="h6">Survey Builder</Typography>
        <Button
          onClick={handlePublish}
          variant="contained"
          sx={{
            backgroundColor: "#a1dac8",
            color: "#fff",
            ":hover": { backgroundColor: "#86c0b1" },
          }}
        >
          PUBLISH
        </Button>
      </Box>

      {/* Main content */}
      <Box
        sx={{
          height: "calc(100vh - 64px)", // Adjust for the Navbar height
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          overflow: "hidden",
          padding: 0,
          margin: 0,
          boxSizing: "border-box",
        }}
      >
        {creator && (
          <Box sx={{ width: "100%", height: "100%", overflow: "auto" }}>
            <SurveyCreatorComponent creator={creator} />
          </Box>
        )}
      </Box>

      {/* Publish Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: 24,
            maxWidth: "400px",
            width: "90%",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "16px" }}>
            Shareable Link
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={publicLink}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleCopyLink}>
                  <ContentCopyIcon />
                </IconButton>
              ),
              readOnly: true,
            }}
          />
          <Button
            onClick={() => setOpen(false)}
            sx={{
              marginTop: "16px",
              backgroundColor: "#a1dac8",
              color: "#fff",
              ":hover": { backgroundColor: "#86c0b1" },
            }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default SurveyBuilder;
