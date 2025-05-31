import { StreamChat } from 'stream-chat';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

class StreamClientSingleton {
  constructor() {
    this.client = null;
    this.currentUserId = null;
  }

  async getClient() {
    if (!this.client) {
      this.client = StreamChat.getInstance(STREAM_API_KEY);
    }
    return this.client;
  }

  async connectUser(userData, token) {
    const client = await this.getClient();
    
    // Only connect if not already connected or if connecting as a different user
    if (!client.userID || client.userID !== userData.id) {
      if (client.userID) {
        await client.disconnectUser();
      }
      await client.connectUser(userData, token);
      this.currentUserId = userData.id;
    }
    
    return client;
  }

  async disconnectUser() {
    if (this.client && this.client.userID) {
      await this.client.disconnectUser();
      this.currentUserId = null;
    }
  }

  isConnectedUser(userId) {
    return this.client && this.client.userID === userId;
  }
}

export const streamClient = new StreamClientSingleton();