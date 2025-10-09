import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {

    fetchSession,
    loginUser,
    logOut,
    registerUser
} from "../api/queries/auth.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useAuth = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const sessionQuery = useQuery({
        queryKey: ["auth", "session"],
        queryFn: fetchSession,
        refetchOnWindowFocus: false,
        staleTime: 30 * 60 * 1000,
        cacheTime: 60 * 60 * 1000,
    });

    const registerMutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            console.log(data);
            navigate("/login");
        },
        onError: (error) => {
            toast(
                error.response.data.message || " Something went wrong ,Please refresh"
            );
            console.error("Registration failed:", error);
        },
    });

    // Login User Mutation
    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            // console.log(data.data.data);
            const user = data?.data?.data
            localStorage.setItem("session", JSON.stringify(user));
            queryClient.invalidateQueries(["auth", "session"]);
            if (user.role == "admin") navigate("/admin");
            else if (user.role == "creator") navigate("/creator");
            else navigate("/approver");
        },
        onError: (error) => {
            console.error("Login error:", error);
            toast(
                error.response.data.message ||
                "Invalid User Credentials , Please login again"
            );
        },
    });

    // Logout Mutation
    const logoutMutation = useMutation({
        mutationFn: logOut,
        onSuccess: () => {
            queryClient.invalidateQueries(["auth", "session"]);
            localStorage.clear();
            navigate("/login");
        },
        onError: (error) => {
            toast(
                error.response.data.message || " Something went wrong ,Please refresh"
            );
            console.error("Logout error:", error);
        },
    });

    return {
        sessionQuery,
        registerMutation,
        loginMutation,
        logoutMutation,
    };
};