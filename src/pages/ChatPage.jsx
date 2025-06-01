import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import ChannelList from "../components/ChannelList";

import 'stream-chat-react/dist/css/v2/index.css';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// Initialize StreamChat client outside the component to ensure it's a singleton
const chatClientInstance = StreamChat.getInstance(STREAM_API_KEY);

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const navigate = useNavigate();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  const handleNewMessage = useCallback((event) => {
    // Only handle notifications for messages not from the current user
    if (event.user.id === authUser?._id) return;   

    // Show desktop notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('New Message', {
        body: `${event.user.name}: ${event.message.text}`,
        icon: event.user.image
      });
    }
  }, [authUser]);

  useEffect(() => {
   if ('Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission().catch(console.error);
}

  }, []);

 useEffect(() => {
  const initChat = async () => {
    if (!tokenData?.token || !authUser) return;

    try {
      const client = await streamClient.connectUser(
        {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        },
        tokenData.token
      );

      client.off('message.new', handleNewMessage); // prevent duplicate listeners
      client.on('message.new', handleNewMessage);

      if (targetUserId) {
        const channelId = [authUser._id, targetUserId].sort().join("-");
        let currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        // Only call watch if needed
        if (!currChannel.initialized) {
          await currChannel.watch();
        }

        setChannel(currChannel);
      }

      setChatClient(client);
    } catch (error) {
      console.error("Chat init error:", error);
      toast.error("Chat initialization failed.");
    } finally {
      setLoading(false);
    }
  };

  initChat();

  return () => {
    chatClient?.off('message.new', handleNewMessage); // ✅ correct cleanup
  };
}, [tokenData, authUser, targetUserId, handleNewMessage]);


  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });
      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !chatClient) return <ChatLoader />;

  return (
    <div className="p-4 min-h-screen bg-base-200 text-base-content" data-theme="mytheme">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-xl shadow-xl bg-base-100 h-[85vh] flex overflow-hidden">
          <Chat client={chatClient}>
            <div className="flex h-full w-full">
              <div className="w-80 border-r border-base-300">
                <ChannelList client={chatClient} />
              </div>
              {channel ? (
                <div className="flex-1">
                  <Channel channel={channel}>
                    <div className="relative flex flex-col h-full">
                      <div className="absolute top-2 right-2 z-10">
                        <CallButton handleVideoCall={handleVideoCall} />
                      </div>
                      <Window>
                        <ChannelHeader />
                        <MessageList />
                        <MessageInput focus />
                      </Window>
                      <Thread />
                    </div>
                  </Channel>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-lg text-base-content/70">Select a chat to start messaging</p>
                </div>
              )}
            </div>
          </Chat>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
