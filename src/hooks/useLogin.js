import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api";

const useLogin = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess : () => {queryClient.invalidateQueries({ queryKey: ["authUser"] })
   // console.log("Login successful!")},
  //   onSuccess: (data) => {
  //   console.log('Mutation successful!', data);
  // },

    
  });
// console.log(mutate, isPending, error);

  return { error, isPending, loginMutation: mutate };
};

export default useLogin;
