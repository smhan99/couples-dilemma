import { useAuth } from "../Context/AuthContext";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import plate from "../assets/blueplate.png";

const lightGray = grey[300];

const Login = () => {
  const { setAuthUser, setIsLoggedIn } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    // fetch auth from DB with user object
    console.log({
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
    });

    // if user authenticated
    setIsLoggedIn(true);
    setAuthUser({
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
    });
  };

  return (
    <Container maxWidth="sm">
      <img src={plate} alt="blue plate with fork and knife" className="logo" />
      <Box
        sx={{
          backgroundColor: lightGray,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <Typography component="h2" variant="h5" color="primary">
          Current User?
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
          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
