import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import ScrollableTabs from '../components/ScrollableTabs';

const Reports = () => {
    const { id } = useParams();  // Get project ID from the URL

    return (
        <Box>
            <ScrollableTabs />
            <Box sx={{ p: 4 }}>
                <Typography variant="h4">
                    Reports for Project ID: {id}
                </Typography>
                {/* Results content goes here */}
            </Box>
        </Box>
    );
};

export default Reports;
