import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { purple, grey } from "@mui/material/colors";

const lightGrey = grey[300];
const darkPurple = purple[600];

const Signup = () => {
  const { setAuthUser, setIsLoggedIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://bhupathitharun.pythonanywhere.com/api/registerUser", {
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
        if (resp.response === "User successfully created") {
          setIsLoggedIn(true);
          setAuthUser({
            username: username,
            password: password,
          });
          localStorage.setItem('user', JSON.stringify({
            username,
            password,
          }))
        }
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
