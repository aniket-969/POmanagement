import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema} from "../../schema/auth.js"
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    Stack,
} from "@mui/material";

const defaultValues = {
    fullName: "",
    email: "",
    password: "",
};

export default function RegisterForm({ onSubmit: handleRegister }) {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues,
    });

    const onSubmit = async (data) => {
        try {

            console.log("Register data:", data);
            return
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Box 
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft:5,
                marginRight:5,
                width:"100%"
            }}
        >
           <Paper
      elevation={3}
      sx={{
        width: "100%",        
        // maxWidth: { xs: 520, sm: 420, md: 480 },
        maxWidth:"350px", 
        p: 4,
        m:2,
        borderRadius: 3,        
      }}
    >

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Stack spacing={2}>
                        {/* Full Name */}
                        <Controller
                            name="fullName"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Full Name"
                                    error={!!errors.fullName}
                                    helperText={errors.fullName?.message}
                                    fullWidth
                                />
                            )}
                        />

                        {/* Email */}
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Email"
                                    type="email"
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    fullWidth
                                />
                            )}
                        />

                        {/* Password */}
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Password"
                                    type="password"
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                    fullWidth
                                />
                            )}
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={isSubmitting}
                            sx={{ mt: 1 }}
                        >
                            {isSubmitting ? "Registering..." : "Register"}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}
