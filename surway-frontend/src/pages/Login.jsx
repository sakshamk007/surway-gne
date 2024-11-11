// 

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar'; // Import Avatar
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // Import Icon

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

function Login() {
  const [userDetails, setUserDetails] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

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

    try {
      // Validation
      const validationErrors = {};
      for (const key in userDetails) {
        validationErrors[key] = validateField(key, userDetails[key]);
      }
      setErrors(validationErrors);

      // Check if there are any errors
      if (Object.values(validationErrors).some((error) => error !== "")) {
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`http://localhost:8000/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userDetails),
      });
      const json = await response.json();
      if (json.success) {
        if (json.message === "verify") {
          toast.warning("Please verify your account");
          setTimeout(() => {
            navigate("/verify-user");
          }, 2000);
        } else {
          toast.success("Successfully logged in");
          setTimeout(() => {
            navigate("/home");
          }, 1000);
        }
      } else {
        toast.error(json.message);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
      setIsSubmitting(false);
    }
  };

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "email":
        return /\S+@\S+\.\S+/.test(value) ? "" : "Invalid email address";
      case "password":
        return value.length >= 8 ? "" : "Password must be at least 8 characters long";
      default:
        return "";
    }
  };

  return (
    <ThemeProvider theme={theme}>
    <Container component="main" maxWidth="xs" style={{ marginBottom: "100px" }}>
      <CssBaseline />
      <ToastContainer />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 5,
        }}>
        <Avatar sx={{ m: 1, bgcolor: '#a1dac8' }}>
                        <LockOutlinedIcon />
                    </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            InputLabelProps={{ shrink: true }}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            value={userDetails.email}
            onChange={handleChange}
            autoFocus
            error={Boolean(errors.email)}
            helperText={errors.email}
          />
          <TextField
            InputLabelProps={{ shrink: true }}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={isPasswordVisible ? "text" : "password"}
            value={userDetails.password}
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
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Sign In"}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                href="/forgotpassword"
                variant="body2"
                sx={{
                  color: "#1b29c2",
                  textDecoration: "none",
                  "&:hover": {
                    color: "#1bb1c2",
                  },
                }}
              >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link
                href="/"
                variant="body2"
                sx={{
                  color: "#1b29c2",
                  textDecoration: "none",
                  "&:hover": {
                    color: "#1bb1c2",
                  },
                }}
              >
                Do not have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
    </ThemeProvider>
  );
}

export default Login;
