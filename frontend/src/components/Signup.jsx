import { Box, Button } from "@mui/material";
import { indigo, grey } from "@mui/material/colors";

// MUI color palette and customization
// https://mui.com/material-ui/customization/color/

const primary = grey[800];
const success = indigo[600];

const Signup = () => {
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
        <p>Create account form here</p>
        <Button variant="contained" sx={{ background: success }}>
          Create Account
        </Button>
      </Box>
    </div>
  );
};

export default Signup;
