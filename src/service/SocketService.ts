import io from 'socket.io-client';
import {SOCKET_URL} from '../Network/config/url';
// process.env.DEBUG = '*';

class WSService {
  initializeSocket = ({userId}: any, onCallApi: () => void) => {
    try {
      //   if (!userId) {
      //     console.log('Skipping socket initialization.', 'userId not found');
      //     return;
      //   }

      this.socket = io('http://15.206.105.61:8001', {
        transports: ['websocket'],
        path: '',
      });

      this.socket.on('connect', (_) => {
        console.log(`userMessageUserId_${userId} =======>`);
        onCallApi();
      });

      this.socket.on('disconnect', () => {
        console.log('\n\n===== socket disconnected =====\n\n');
      });

      this.socket.on('connect_error', (err: any) => {
        console.log('\n\nsocket connection error: ', err);
      });

      this.socket.on('error', (err: any) => {
        // console.log('socket error: ', err);
        console.log('\n\nsocket error: ', err);
      });

      this.socket.on('reconnect_attempt', () => {
        console.log('\n\n===== reconnecting =====\n\n');
      });

      this.socket.on(`userMessageUserId_${userId}`, listener => {
        let timer;
        if (timer) {
          clearTimeout(timer);
          timer = setTimeout(() => {
            onCallApi();
          }, 2000);
          return;
        }
        timer = setTimeout(() => {
          onCallApi();
        }, 2000);
      });

      // this.socket.on('connection-Response', (data) => {
      //     console.log('data received from server is: ', data);
      // });
    } catch (error) {
      console.log('\n\ninitialize token error: ', error);
    }
  };

  emit(event: string, data = {}, cb: any) {
    this.socket.emit(event, data, cb);
  }

  on(event: string, cb: any) {
    this.socket.on(event, cb);
  }

  send(message) {
    this.socket.send(message);
  }

  removeListener(listenerName, cb) {
    this.socket.removeListener(listenerName, cb);
  }

  removeAllListener() {
    this.socket.removeListener();
  }
}

const socketServices = new WSService();

export default socketServices;
