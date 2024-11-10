import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Survey } from "survey-react";
import "survey-core/defaultV2.css";

const SurveyRespondent = () => {
  const { id } = useParams(); // Capture survey ID from URL
  const [surveyJSON, setSurveyJSON] = useState(null);

  useEffect(() => {
    // Fetch the survey JSON for this respondent
    const fetchSurvey = async () => {
      try {
        const response = await axios.get(`https://surway-backend.onrender.com/api/projects/${id}/survey`);
        setSurveyJSON(response.data);
      } catch (err) {
        console.error("Failed to load survey", err);
      }
    };
    fetchSurvey();
  }, [id]);

  const handleComplete = async (survey) => {
    console.log("Survey data:", survey.data);
    try {
        const responseData = survey.data;
        if (typeof responseData !== 'object' || responseData === null) {
            console.error("Survey response data is invalid:", responseData);
            return;
        }
        await axios.post(`https://surway-backend.onrender.com/api/projects/${id}/survey/submit`, {
            responses: responseData,
        });
        alert("Thank you for completing the survey!");
    } catch (err) {
        console.error("Error submitting survey response:", err);
    }
};


  // Show loading text if surveyJSON hasn't been fetched yet
  if (!surveyJSON) return <div>Loading survey...</div>;

  return (
    <Survey json={surveyJSON} onComplete={handleComplete} />
  );
};

export default SurveyRespondent;
