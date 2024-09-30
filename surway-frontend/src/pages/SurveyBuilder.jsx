import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

// Import SurveyJS components
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import "survey-core/defaultV2.css";
import "survey-creator-core/survey-creator-core.css";

const SurveyBuilder = () => {
  const [creator, setCreator] = useState(null);

  // Initialize SurveyJS creator instance
  useEffect(() => {
    const initializeSurveyCreator = () => {
      const creatorOptions = {
        showLogicTab: true,
        isAutoSave: true,
      };
      const newCreator = new SurveyCreator(creatorOptions);
      newCreator.JSON = {
        questions: [],
      };
      setCreator(newCreator);
    };
    initializeSurveyCreator();
  }, []);

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
