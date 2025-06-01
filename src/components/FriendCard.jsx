import { Link } from "react-router";
import { useEffect, useState, useRef, useCallback } from "react";
import { LANGUAGE_TO_FLAG } from "../constants";
import { getLanguageFlag } from "../lib/languageFlag.jsx";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import { streamClient } from "../lib/streamClient";

const FriendCard = ({ friend, authUser }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastMessage, setLastMessage] = useState(null);
  const channelRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const retryDelay = 2000; // 2 seconds

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  const handleMessageEvent = useCallback((event) => {
    setLastMessage(event.message);
    setUnreadCount((prev) => prev + 1);
  }, []);

  const initChat = useCallback(async () => {
    if (!authUser || !tokenData?.token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Always connect user before using client
      await streamClient.connectUser(
        {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        },
        tokenData.token
      );

      const client = await streamClient.getClient(); // Get the actual StreamChat client instance
      const channelId = [authUser._id, friend._id].sort().join("-");
      const channel = client.channel("messaging", channelId);

      await channel.watch();
      channelRef.current = channel;

      // Setup event listeners BEFORE query
      channel.on('message.new', handleMessageEvent);
      channel.on('message.updated', handleMessageEvent);

      // Query state AFTER event listeners to avoid race condition
      const state = await channel.query();
      const messages = state.messages || [];
      if (messages.length > 0) {
        setLastMessage(messages[messages.length - 1]);
      }

      setUnreadCount(channel.countUnread());
      setRetryCount(0); // Reset retry count on success
    } catch (channelError) {
      if (
        (channelError.response && channelError.response.status === 429) ||
        channelError.code === 9
      ) {
        if (retryCount < maxRetries) {
          const delay = retryDelay * Math.pow(2, retryCount);
          console.warn(
            `Rate limit hit. Retrying in ${delay}ms... (Attempt ${
              retryCount + 1
            }/${maxRetries})`
          );
          setRetryCount((prev) => prev + 1);
        } else {
          console.error("Max retries reached for channel initialization:", channelError);
        }
      } else {
        console.error("Channel error:", channelError);
      }
    } finally {
      setIsLoading(false);
    }
  }, [authUser, tokenData, friend._id, handleMessageEvent, retryCount]);

  useEffect(() => {
    if (retryCount > 0) {
      const delay = retryDelay * Math.pow(2, retryCount - 1);
      const timer = setTimeout(() => {
        initChat();
      }, delay);
      return () => clearTimeout(timer);
    }

    initChat();

    return () => {
      if (channelRef.current) {
        channelRef.current.off("message.new", handleMessageEvent);
        channelRef.current.off("message.updated", handleMessageEvent);
        channelRef.current.stopWatching();
      }
    };
  }, [initChat, retryCount, handleMessageEvent]);

  if (isLoading) {
    return (
      <div className="card bg-base-200 hover:shadow-md transition-shadow animate-pulse">
        <div className="card-body p-4">
          <div className="h-12 bg-base-300 rounded-full w-12 mb-3"></div>
          <div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-base-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={friend.profilePic} alt={friend.fullName} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold truncate">{friend.fullName}</h3>
          {lastMessage?.text && (
  <p>
    {lastMessage.text.length > 50 ? `${lastMessage.text.slice(0, 50)}...` : lastMessage.text}
  </p>
)}

          </div>
          {unreadCount > 0 && (
            <div className="badge badge-primary badge-sm">{unreadCount}</div>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;
