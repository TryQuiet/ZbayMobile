import {
  DisplayableMessage,
  IChannelInfo,
} from '../../store/publicChannels/publicChannels.types';

export interface ChatProps {
  channel: IChannelInfo;
  messages: DisplayableMessage[];
  user: string;
}
