import React, { useEffect, useState } from "react";
import { getOutgoingFriendReqs, getRecommendedUsers, searchUsers } from "../lib/api";
import { useSendFriendRequest } from "../hooks/useSendFriendRequest";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon } from "lucide-react";
import { capitialize } from "../lib/utils";
import { getLanguageFlag } from "../lib/languageFlag.jsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { mutate: sendRequestMutation, isPending } = useSendFriendRequest();
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();

  const { data: recommendedUsersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const recommendedUsers = Array.isArray(recommendedUsersData)
    ? recommendedUsersData
    : recommendedUsersData?.recommendedUsers || [];

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        if (req.recipient) {
          outgoingIds.add(req.recipient._id);
        }
      });
    }
    setOutgoingRequestsIds(outgoingIds);
  }, [outgoingFriendReqs]);

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await searchUsers(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error("Error searching users:", err);
      setError("Failed to search users. Please try again.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Search Users</h1>

        <div className="flex mb-6">
          <input
            type="text"
            placeholder="Search by email or language..."
            className="input input-bordered w-full max-w-xs mr-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && searchQuery.trim() !== "" && searchResults.length === 0 && (
          <p>No users found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((user) => {
            const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
            const alreadyRequestedYou = user?.outgoingFriendRequests?.some(
              (req) => req.sender?._id === user._id
            );

            return (
              <div
                key={user._id}
                className="card bg-base-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="card-body p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="avatar size-16 rounded-full">
                      <img src={user.profilePic} alt={user.fullName} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg">{user.fullName}</h3>
                      {user.location && (
                        <div className="flex items-center text-xs opacity-70 mt-1">
                          <MapPinIcon className="size-3 mr-1" />
                          {user.location}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <span className="badge badge-secondary">
                      {getLanguageFlag(user.nativeLanguage)}
                      Native: {capitialize(user.nativeLanguage)}
                    </span>
                    <span className="badge badge-outline">
                      {getLanguageFlag(user.learningLanguage)}
                      Learning: {capitialize(user.learningLanguage)}
                    </span>
                  </div>

                  {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

                  <button
                    className={`btn w-full mt-2 ${
                      hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                    }`}
                    onClick={() => sendRequestMutation(user._id)}
                    disabled={hasRequestBeenSent || alreadyRequestedYou || isPending}
                  >
                    {hasRequestBeenSent ? (
                      <>
                        <CheckCircleIcon className="size-4 mr-2" />
                        Request Sent
                      </>
                    ) : (
                      <>
                        <UserPlusIcon className="size-4 mr-2" />
                        Send Friend Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommended Users Section */}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
                <p className="opacity-70">
                  Discover perfect language exchange partners based on your profile
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                const alreadyRequestedYou = user?.outgoingFriendRequests?.some(
                  (req) => req.sender?._id === user._id
                );

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages with flags */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

                      {/* Action button */}
                      <button
                        className={`btn w-full mt-2 ${hasRequestBeenSent ? "btn-disabled" : "btn-primary"}`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || alreadyRequestedYou || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SearchPage;
