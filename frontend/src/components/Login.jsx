import { Box, Button } from "@mui/material";
import { purple, grey } from "@mui/material/colors";

// MUI color palette and customization
// https://mui.com/material-ui/customization/color/

const primary = grey[800];
const success = purple[600];

const Login = () => {
  return (
    <div>
      <Box
        sx={{
          width: 300,
          height: 150,
          backgroundColor: primary,
          "&:hover": {
            backgroundColor: "primary.main",
            opacity: [0.9, 0.8, 0.7],
          },
        }}
      >
        <p>Login form here</p>
        <Button variant="contained" sx={{ background: success }}>
          Login
        </Button>
      </Box>{" "}
    </div>
  );
};

export default Login;
