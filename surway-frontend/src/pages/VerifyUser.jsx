import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';

// Create a theme with custom styles (optional)
const theme = createTheme({
    components: {
        MuiAvatar: {
            styleOverrides: {
                root: {
                    margin: '8px',
                    backgroundColor: '#a1dac8', // Changed to the new color
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    margin: '8px 0',
                    backgroundColor: '#a1dac8', // Changed to the new color
                    '&:hover': {
                        backgroundColor: '#8cbcb1', // Optional: Darken on hover
                    },
                },
            },
        },
    },
});



export default function VerifyUser() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ email: '', otp: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTPField, setShowOTPField] = useState(false);
  const location = useLocation();
  const email = location.state && location.state.email;

  if (email) {
    userDetails.email = email;
  }

  const handleGetOTP = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:8000/api/auth/sendotp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userDetails.email }),
      });

      const json = await response.json();

      if (json.success) {
        toast.success('OTP sent successfully');
        setShowOTPField(true); // Show OTP field after successful OTP request
      } else {
        toast.error(json.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while sending OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:8000/api/auth/verifyotp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( userDetails ),
      });

      const json = await response.json();

      if (json.success) {
        toast.success('Verified Successfully');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(json.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred during verification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

 

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" sx={{ marginTop: 2, marginBottom: 10 }}>
        <CssBaseline />
        <ToastContainer />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: '#a1dac8' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Verify Your Email
          </Typography>
          <Box component="form" onSubmit={handleVerifyOTP} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={userDetails.email}
              autoComplete="email"
              onChange={handleChange}
              autoFocus
              InputProps={{ sx: { padding: '8px' } }}
            />
            {showOTPField && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="otp"
                label="OTP"
                value={userDetails.otp}
                type="text"
                onChange={handleChange}
                InputProps={{ sx: { padding: '8px' } }}
              />
            )}
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              onClick={showOTPField ? handleVerifyOTP : handleGetOTP}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} color="primary" /> : showOTPField ? 'Verify' : 'Get OTP'}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
