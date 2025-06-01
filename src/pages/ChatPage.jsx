import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import { streamClient } from "../lib/streamClient";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import ChannelList from "../components/ChannelList";
// import Navbar from "../components/Navbar"; // import here

import 'stream-chat-react/dist/css/v2/index.css';

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  const handleNewMessage = useCallback((event) => {
    if (event.user.id === authUser?._id) return;
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

        client.off('message.new', handleNewMessage);
        client.on('message.new', handleNewMessage);

        if (targetUserId) {
          const channelId = [authUser._id, targetUserId].sort().join("-");
          let currChannel = client.channel("messaging", channelId, {
            members: [authUser._id, targetUserId],
          });

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
      chatClient?.off('message.new', handleNewMessage);
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
        {/* Pass toggleMenu and isMenuOpen to Navbar */}
        {/* <Navbar toggleMenu={() => setIsMenuOpen((prev) => !prev)} /> */}

        <div className="rounded-xl shadow-xl bg-base-100 h-[85vh] flex overflow-hidden relative">
          <Chat client={chatClient}>
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-10 bg-base-100 w-72 border-r border-base-300 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:w-80`}>
              <ChannelList client={chatClient} onSelectChannel={() => setIsMenuOpen(false)} />
            </div>

            {/* Chat window */}
            <div className="flex-1">
              {channel ? (
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
              ) : (
                <div className="flex h-full items-center justify-center">
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
