import { useAuth } from "../Context/AuthContext";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { purple, grey } from "@mui/material/colors";

const lightGrey = grey[300];
const darkPurple = purple[600];

const Signup = () => {
  const { setAuthUser, setIsLoggedIn } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    // post new user to DB with user object

    console.log({
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
    });

    setIsLoggedIn(true);
    setAuthUser({
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
    });
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          backgroundColor: lightGrey,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Typography component="h2" variant="h5" sx={{ color: darkPurple }}>
          New User?
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="username"
            name="username"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="password"
            name="password"
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ background: darkPurple }}
          >
            Create Account
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
