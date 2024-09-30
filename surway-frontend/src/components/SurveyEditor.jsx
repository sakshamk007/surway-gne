// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   IconButton,
//   Grid,
//   TextField,
//   Menu,
//   MenuItem,
//   Button,
//   Collapse,
//   Box,
//   ListItemIcon,
//   ListItemText
// } from "@mui/material";
// import { MoreVert, ExpandMore, ExpandLess, Add } from "@mui/icons-material";

// // Importing the MUI Icons for the dropdown menu
// import MultipleChoiceIcon from '@mui/icons-material/CheckBox';
// import TextEntryIcon from '@mui/icons-material/TextFields';
// import GraphicIcon from '@mui/icons-material/Image';
// import MatrixIcon from '@mui/icons-material/GridOn';
// import TuneIcon from '@mui/icons-material/Tune';
// import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
// import RankOrderIcon from '@mui/icons-material/List';
// import SideBySideIcon from '@mui/icons-material/ViewColumn';

// const SurveyEditor = () => {
//   const [expanded, setExpanded] = useState(true);
//   const [blockMenuAnchorEl, setBlockMenuAnchorEl] = useState(null);
//   const [questionMenuAnchorEls, setQuestionMenuAnchorEls] = useState({});
//   const [questions, setQuestions] = useState([{ id: 1, questionText: "", options: [""] }]);
//   const [addQuestionAnchorEl, setAddQuestionAnchorEl] = useState(null);

//   // Toggle block expansion
//   const handleExpandClick = () => {
//     setExpanded(!expanded);
//   };

//   // Handle block menu actions
//   const handleBlockMenuClick = (event) => {
//     setBlockMenuAnchorEl(event.currentTarget);
//   };

//   const handleBlockMenuClose = () => {
//     setBlockMenuAnchorEl(null);
//   };

//   // Add a new question (default, will be updated when selecting type)
//   const addNewQuestion = (questionType) => {
//     const newQuestion = { id: questions.length + 1, questionText: questionType, options: [""] };
//     setQuestions([...questions, newQuestion]);
//     setAddQuestionAnchorEl(null);  // Close the dropdown after adding a question
//   };

//   // Handle question text change
//   const handleQuestionTextChange = (id, newText) => {
//     const updatedQuestions = questions.map(q =>
//       q.id === id ? { ...q, questionText: newText } : q
//     );
//     setQuestions(updatedQuestions);
//   };

//   // Open and close question menu
//   const handleQuestionMenuClick = (event, questionId) => {
//     setQuestionMenuAnchorEls((prev) => ({ ...prev, [questionId]: event.currentTarget }));
//   };

//   const handleQuestionMenuClose = (questionId) => {
//     setQuestionMenuAnchorEls((prev) => ({ ...prev, [questionId]: null }));
//   };

//   // Handle "Add New Question" dropdown
//   const handleAddQuestionClick = (event) => {
//     setAddQuestionAnchorEl(event.currentTarget);
//   };

//   const handleAddQuestionClose = () => {
//     setAddQuestionAnchorEl(null);
//   };

//   // Delete question
//   const deleteQuestion = (questionId) => {
//     setQuestions(questions.filter((q) => q.id !== questionId));
//     handleQuestionMenuClose(questionId);
//   };

//   return (
//     <Grid container spacing={2} sx={{ padding: 2 }}>
//       {/* Main Card Block */}
//       <Grid item xs={12}>
//         <Card variant="outlined">
//           <CardContent>
//             <Grid container alignItems="center">
//               {/* Expand/Collapse Icon */}
//               <Grid item>
//                 <IconButton onClick={handleExpandClick}>
//                   {expanded ? <ExpandLess /> : <ExpandMore />}
//                 </IconButton>
//               </Grid>

//               {/* Block Title */}
//               <Grid item xs>
//                 <Typography variant="subtitle2">
//                   Default Question Block | No. of Questions: {questions.length}
//                 </Typography>
//               </Grid>

//               {/* 3 Dots Menu for Block Options */}
//               <Grid item>
//                 <IconButton onClick={handleBlockMenuClick}>
//                   <MoreVert />
//                 </IconButton>
//                 <Menu
//                   anchorEl={blockMenuAnchorEl}
//                   open={Boolean(blockMenuAnchorEl)}
//                   onClose={handleBlockMenuClose}
//                 >
//                   <MenuItem onClick={handleBlockMenuClose}>Add Block Below</MenuItem>
//                   <MenuItem onClick={handleBlockMenuClose}>Move Block</MenuItem>
//                   <MenuItem onClick={handleBlockMenuClose}>Copy</MenuItem>
//                   <MenuItem onClick={handleBlockMenuClose}>Lock</MenuItem>
//                   <MenuItem onClick={handleBlockMenuClose}>Delete</MenuItem>
//                   <MenuItem onClick={handleBlockMenuClose}>Collapse Questions</MenuItem>
//                   <MenuItem onClick={handleBlockMenuClose}>Preview Block</MenuItem>
//                 </Menu>
//               </Grid>
//             </Grid>

//             {/* Collapse/Expand Questions */}
//             <Collapse in={expanded}>
//               <Box mt={2}>
//                 {/* Dynamic Questions */}
//                 {questions.map((question, qIndex) => (
//                   <Box
//                     key={question.id}
//                     mb={2}
//                     p={2}
//                     border={1}
//                     borderColor="grey.400"
//                     borderRadius={1}
//                     position="relative"
//                   >
//                     <Grid container justifyContent="space-between" alignItems="center">
//                       {/* Question Text Input */}
//                       <Grid item xs={11}>
//                         <TextField
//                           fullWidth
//                           label={`Question ${qIndex + 1}`}
//                           variant="outlined"
//                           value={question.questionText}
//                           onChange={(e) => handleQuestionTextChange(question.id, e.target.value)}
//                         />
//                       </Grid>

//                       {/* 3 Dots Menu for Question Options */}
//                       <Grid item>
//                         <IconButton
//                           onClick={(e) => handleQuestionMenuClick(e, question.id)}
//                         >
//                           <MoreVert />
//                         </IconButton>
//                         <Menu
//                           anchorEl={questionMenuAnchorEls[question.id]}
//                           open={Boolean(questionMenuAnchorEls[question.id])}
//                           onClose={() => handleQuestionMenuClose(question.id)}
//                         >
//                           <MenuItem onClick={() => handleQuestionMenuClose(question.id)}>
//                             Move Question
//                           </MenuItem>
//                           <MenuItem onClick={() => handleQuestionMenuClose(question.id)}>
//                             Copy
//                           </MenuItem>
//                           <MenuItem onClick={() => handleQuestionMenuClose(question.id)}>
//                             Add Page Break
//                           </MenuItem>
//                           <MenuItem onClick={() => deleteQuestion(question.id)}>
//                             Delete
//                           </MenuItem>
//                         </Menu>
//                       </Grid>
//                     </Grid>
//                   </Box>
//                 ))}

//                 {/* Add New Question Button with Dropdown */}
//                 <Grid container justifyContent="flex-end">
//                   <Button
//                     variant="contained"
//                     startIcon={<Add />}
//                     onClick={handleAddQuestionClick}
//                     sx={{ bgcolor: 'primary.main', color: 'white' }}
//                   >
//                     Add New Question
//                   </Button>

//                   {/* Dropdown Menu for New Question Types */}
//                   <Menu
//                     anchorEl={addQuestionAnchorEl}
//                     open={Boolean(addQuestionAnchorEl)}
//                     onClose={handleAddQuestionClose}
//                   >
//                     <MenuItem onClick={() => addNewQuestion("Multiple Choice")}>
//                       <ListItemIcon>
//                         <MultipleChoiceIcon sx={{ color: 'primary.light' }} />
//                       </ListItemIcon>
//                       <ListItemText primary="Multiple Choice" />
//                     </MenuItem>
//                     <MenuItem onClick={() => addNewQuestion("Text Entry")}>
//                       <ListItemIcon>
//                         <TextEntryIcon sx={{ color: 'primary.light' }} />
//                       </ListItemIcon>
//                       <ListItemText primary="Text Entry" />
//                     </MenuItem>
//                     <MenuItem onClick={() => addNewQuestion("Text / Graphic")}>
//                       <ListItemIcon>
//                         <GraphicIcon sx={{ color: 'primary.light' }} />
//                       </ListItemIcon>
//                       <ListItemText primary="Text / Graphic" />
//                     </MenuItem>
//                     <MenuItem onClick={() => addNewQuestion("Matrix Table")}>
//                       <ListItemIcon>
//                         <MatrixIcon sx={{ color: 'primary.light' }} />
//                       </ListItemIcon>
//                       <ListItemText primary="Matrix Table" />
//                     </MenuItem>
//                     <MenuItem onClick={() => addNewQuestion("Slider")}>
//                       <ListItemIcon>
//                         <TuneIcon sx={{ color: 'primary.light' }} />
//                       </ListItemIcon>
//                       <ListItemText primary="Slider" />
//                     </MenuItem>
//                     <MenuItem onClick={() => addNewQuestion("Form Field")}>
//                       <ListItemIcon>
//                         <DnsOutlinedIcon sx={{ color: 'primary.light' }} />
//                       </ListItemIcon>
//                       <ListItemText primary="Form Field" />
//                     </MenuItem>
//                     <MenuItem onClick={() => addNewQuestion("Rank Order")}>
//                       <ListItemIcon>
//                         <RankOrderIcon sx={{ color: 'primary.light' }} />
//                       </ListItemIcon>
//                       <ListItemText primary="Rank Order" />
//                     </MenuItem>
//                     <MenuItem onClick={() => addNewQuestion("Side by Side")}>
//                       <ListItemIcon>
//                         <SideBySideIcon sx={{ color: 'primary.light' }} />
//                       </ListItemIcon>
//                       <ListItemText primary="Side by Side" />
//                     </MenuItem>
//                   </Menu>
//                 </Grid>
//               </Box>
//             </Collapse>
//           </CardContent>
//         </Card>
//       </Grid>
//     </Grid>
//   );
// };

// export default SurveyEditor;
