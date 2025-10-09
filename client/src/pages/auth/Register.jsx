import { Box, Typography,Button } from "@mui/material";
import RegisterForm from "../../components/auth/registerForm";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        maxHeight: "100vh",
        gap: 2,
        mt:5,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <RegisterForm />
      <Box>
        Already registered?
        <Link to={'/login'}>
         <Button>login instead</Button>
        </Link>
       
      </Box>
      
    </Box>
  );
};

export default Register;
