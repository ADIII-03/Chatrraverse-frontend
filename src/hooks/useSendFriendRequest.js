import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendFriendRequest } from "../lib/api";

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
      queryClient.invalidateQueries({ queryKey: ["users"] }); // Invalidate recommended users to update button state
    },
  });

  return { mutate, isPending };
};
