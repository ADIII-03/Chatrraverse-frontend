import React, { useState } from 'react';
import { searchUsers } from '../lib/api';
import FriendCard from '../components/FriendCard';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const results = await searchUsers(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error('Error searching users:', err);
      setError('Failed to search users. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Users</h1>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search by email or language..."
          className="input input-bordered w-full max-w-xs mr-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchResults.length > 0 ? (
          searchResults.map((user) => (
            <FriendCard key={user._id} friend={user} />
          ))
        ) : (
          !loading && !error && searchQuery.trim() !== '' && <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;