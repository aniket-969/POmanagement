import { Box, Typography,Button } from "@mui/material";
import LoginForm from "../../components/auth/loginForm";
import { Link } from "react-router-dom";

const Login = () => {
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
        Login
      </Typography>
      <LoginForm />
      <Box>
        Not registered?
        <Link to={'/register'}>
         <Button>Signup instead</Button>
        </Link>
       
      </Box>
      
    </Box>
  );
};

export default Login;
