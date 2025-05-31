// src/pages/FriendsPage.jsx
import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import FriendCard from "../components/FriendCard.jsx";
import NoFriendsFound from "../components/NoFriendsFound.jsx";

const FriendsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const friends = data?.friends || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 container mx-auto">
      <h2 className="text-3xl font-bold mb-6">Your Friends</h2>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : friends.length === 0 ? (
        <NoFriendsFound />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {friends.map((friend) => (
            <FriendCard key={friend._id} friend={friend} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
