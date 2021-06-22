import { io, Socket } from 'socket.io-client';
import config from '../../store/socket/config';
import { SocketActionTypes } from '../../store/socket/const/actionTypes';

export const pushNotifications = async (): Promise<void> => {
  const socket = await connect();

  socket.on(SocketActionTypes.RESPONSE_FETCH_ALL_MESSAGES, payload => {
    console.log(`Socket event received: ${payload.messages}`);
  });

  return new Promise(() => null);
};

export const connect = async (): Promise<Socket> => {
  const socket = io(config.socket.address);
  return await new Promise(resolve => {
    socket.on('connect', async () => {
      resolve(socket);
    });
  });
};
