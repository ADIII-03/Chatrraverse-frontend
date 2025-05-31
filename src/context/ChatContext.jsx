// src/context/ChatContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { streamClient } from "../lib/streamClient";

const ChatContext = createContext();

export const ChatProvider = ({ children, authUser, token }) => {
  const [unreadMap, setUnreadMap] = useState({});
  const [lastMessages, setLastMessages] = useState({});

  useEffect(() => {
    if (!authUser || !token) return;

    const setup = async () => {
      try {
        await streamClient.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          token
        );

        const client = await streamClient.getClient();

        client.on("message.new", async (event) => {
          const channelId = event.channel_id;

          setLastMessages((prev) => ({
            ...prev,
            [channelId]: event.message,
          }));

          setUnreadMap((prev) => ({
            ...prev,
            [channelId]: (prev[channelId] || 0) + 1,
          }));
        });
      } catch (err) {
        console.error("Stream client setup error:", err);
      }
    };

    setup();

    return () => {
      streamClient.disconnectUser();
    };
  }, [authUser, token]);

  return (
    <ChatContext.Provider value={{ unreadMap, lastMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
