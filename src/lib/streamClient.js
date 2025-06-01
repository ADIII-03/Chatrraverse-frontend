import { StreamChat } from 'stream-chat';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

class StreamClientSingleton {
  constructor() {
    this.client = null;
    this.currentUserId = null;
    this.connecting = false;
  }

  async getClient() {
    if (!this.client) {
      this.client = StreamChat.getInstance(STREAM_API_KEY);
    }
    return this.client;
  }

  async connectUser(userData, token) {
    if (!userData || !userData.id || !token) {
      throw new Error("User data or token is missing in connectUser()");
    }

    const client = await this.getClient();

    if (this.connecting) return client;
    this.connecting = true;

    try {
      if (
        !client.userID ||
        client.userID !== userData.id ||
        !client.wsConnection?.isHealthy
      ) {
        if (client.userID) {
          await client.disconnectUser();
        }
        await client.connectUser(userData, token);
        this.currentUserId = userData.id;
      }
    } finally {
      this.connecting = false;
    }

    return client;
  }

  async disconnectUser() {
    if (this.client && this.client.userID) {
      await this.client.disconnectUser();
      this.currentUserId = null;
      this.client = null;
    }
  }

  isConnectedUser(userId) {
    return this.client && this.client.userID === userId;
  }
}

export const streamClient = new StreamClientSingleton();
