import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import plate from "../assets/blueplate.png";

const lightGray = grey[300];

const Login = () => {
  const { setAuthUser, setIsLoggedIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://bhupathitharun.pythonanywhere.com/api/validateUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: e.currentTarget.username.value,
        password: e.currentTarget.password.value,
      }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.error) alert(resp.error);
        if (resp.response.validated === false) {
          alert("User not found. Please try again or create an account.");
        }
        if (resp.response.validated === true) {
          console.log(resp);
          setIsLoggedIn(true);
          setAuthUser({
            username: username,
            password: password,
          });
          localStorage.setItem('user', JSON.stringify({
            username,
            password,
          }));
        }
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
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
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
