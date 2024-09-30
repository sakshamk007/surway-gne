import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import { Alert } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Avatar from '@mui/material/Avatar'; // Import Avatar
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // Import Icon

// Create a theme with custom styles (optional)
const theme = createTheme({
    components: {
        MuiAvatar: {
            styleOverrides: {
                root: {
                    margin: '8px',
                    backgroundColor: '#1976d2', // Example color
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    margin: '8px 0',
                },
            },
        },
    },
});

function RegisterForm() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [userDetails, setUserDetails] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    // Validation function
    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case 'username':
                return /^[a-zA-Z0-9_]{3,20}$/.test(value) ? '' : 'Username must be 3-20 characters (letters, numbers, underscores)';
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address';
            case 'password':
                return value.length >= 8 ? '' : 'Password must be at least 8 characters long';
            case 'confirmPassword':
                return value === userDetails.password ? '' : 'Passwords do not match';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setUserDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validateField(name, value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validation before submission
        const validationErrors = Object.keys(userDetails).reduce((acc, key) => {
            const error = validateField(key, userDetails[key]);
            return error ? { ...acc, [key]: error } : acc;
        }, {});

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            // API POST request
            const response = await fetch('http://localhost:8000/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(userDetails),
            });
            const json = await response.json();
      
            if (json.success) {
              toast.success('Successfully registered');
              setTimeout(() => {
                navigate('/verify-user', { state: { email: userDetails.email } });
              }, 2000); // Navigate to VerifyUser page after 2000ms
            } else {
              toast.error(json.message);
            }
          } catch (error) {
            toast.error('Registration failed');
          } finally {
            setIsSubmitting(false);
          }
        };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs" sx={{ pb: 5, mt: 5 }}>
                <CssBaseline />
                <ToastContainer />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">Register</Typography>
                    <Box sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            value={userDetails.username}
                            onChange={handleChange}
                            error={Boolean(errors.username)}
                            helperText={errors.username}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            value={userDetails.email}
                            onChange={handleChange}
                            error={Boolean(errors.email)}
                            helperText={errors.email}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            value={userDetails.password}
                            type={isPasswordVisible ? 'text' : 'password'} // Show password text if isPasswordVisible is true
                            onChange={handleChange}
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setIsPasswordVisible((prev) => !prev)}
                                            onMouseDown={(e) => e.preventDefault()}
                                        >
                                            {isPasswordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            value={userDetails.confirmPassword}
                            type="password"
                            onChange={handleChange}
                            error={Boolean(errors.confirmPassword)}
                            helperText={errors.confirmPassword}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isSubmitting}
                            onClick={() => setShowModal(true)}
                        >
                            {isSubmitting ? (
                                <CircularProgress size={24} />
                            ) : (
                                'Register'
                            )}
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="/login" variant="body2" style={{ color: '#0015ff' }}>
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                <Modal open={showModal} onClose={() => setShowModal(false)}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 5
                    }}>
                        <Typography variant="h6" fontWeight={'bold'} gutterBottom>
                            Confirm data before submitting
                        </Typography>
                        <Typography variant="body1">Email: {userDetails.email}</Typography>
                        <Typography variant="body1">Username: {userDetails.username}</Typography>
                        {/* <Alert sx={{ marginTop: 5 }} severity='info'>
            This information will be stored for future operations
          </Alert> */}
                        <hr />
                        <div style={{ display: 'flex', justifyContent: "flex-end", gap: 25, paddingTop: 10 }}>
                            <Button variant="contained" onClick={() => setShowModal(false)}>Cancel</Button>
                            <Button variant="contained" onClick={handleSubmit}>Confirm</Button>
                        </div>
                    </Box>
                </Modal>
            </Container>
        </ThemeProvider>
    );
}

export default RegisterForm;