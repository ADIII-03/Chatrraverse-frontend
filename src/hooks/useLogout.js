import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import { useNavigate } from "react-router";

const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await queryClient.resetQueries({ queryKey: ["authUser"] }); // hard reset
      await queryClient.clear(); // Ensure this is awaited

      // Then clear localStorage/sessionStorage or cookies if needed
      localStorage.removeItem("token");
      sessionStorage.clear();
      console.log("Logout successful, navigating to login."); // Add console log
      navigate("/login", { replace: true });
    },
  });

  const performLogout = () => {
    console.log("Logout function called."); // Add console log
    logoutMutation();
  };

  return { logout: performLogout, isPending, error }; // Return the new logout function
};

export default useLogout;
