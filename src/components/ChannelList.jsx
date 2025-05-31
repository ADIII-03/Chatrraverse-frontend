import { useEffect, useState } from 'react';
import { ChannelList as StreamChannelList, Chat } from 'stream-chat-react';
import { useNavigate } from 'react-router';

const ChannelList = ({ client }) => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  // Filter for messaging channels the user is a member of
  const filters = {
    type: 'messaging',
    members: { $in: [client.userID] }
  };

  // Sort channels by last message timestamp
  const sort = [
    { last_message_at: -1 }
  ];

  const options = {
    state: true,
    watch: true, // Enable real-time updates
    presence: true, // Show online/offline status
    limit: 30 // Number of channels to load at once
  };

  useEffect(() => {
    const handleEvent = (event) => {
      if (event.total_unread_count !== undefined) {
        setUnreadCount(event.total_unread_count);
      }
    };

    client.on('notification.message_new', handleEvent);
    client.on('notification.mark_read', handleEvent);

    return () => {
      client.off('notification.message_new', handleEvent);
      client.off('notification.mark_read', handleEvent);
    };
  }, [client]);

  const CustomChannelPreview = (props) => {
    const { channel, setActiveChannel } = props;
    const member = Object.values(channel.state.members).find(
      (m) => m.user?.id !== client.userID
    );

    if (!member || !member.user) {
      return null; // Or some placeholder if no valid member is found
    }

    const unread = channel.state.unread_counts?.messages; // Add null check here

    return (
      <div
        className="p-4 border-b hover:bg-base-200 cursor-pointer transition-colors"
        onClick={() => {
          setActiveChannel(channel);
          if (member?.user?.id) {
            navigate(`/chat/${member.user.id}`);
          }
        }}
      >
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img src={member.user?.image} alt={member.user?.name} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold truncate">{member.user?.name}</h3>
              {channel.state.last_message_at && (
                <span className="text-sm opacity-70">
                  {new Date(channel.state.last_message_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              )}
            </div>
            {channel.state.last_message?.text && (
              <p className="text-sm opacity-70 truncate">
                {channel.state.last_message.text}
              </p>
            )}
          </div>
          {unread > 0 && (
            <div className="badge badge-primary badge-sm">{unread}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      <StreamChannelList
        filters={filters}
        sort={sort}
        options={options}
        Preview={CustomChannelPreview}
      />
    </div>
  );
};

export default ChannelList;