import React, { useState } from "react";
import { searchUsers } from "../lib/api";
import { useSendFriendRequest } from "../lib/api";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon } from "lucide-react";
import { capitialize } from "../lib/utils";
import { getLanguageFlag } from "../lib/languageFlag.jsx";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { mutate: sendRequestMutation, isPending } = useSendFriendRequest();

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

  // IDs of users who already got friend requests
  const outgoingRequestsIds = new Set(
    searchResults
      .filter((user) => user?.incomingFriendRequests?.length > 0)
      .map((user) => user._id)
  );

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
      </div>
    </div>
  );
};

export default SearchPage;
