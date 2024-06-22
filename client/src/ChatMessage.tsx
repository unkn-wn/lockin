import React from 'react';

interface ChatMessageProps {
  message: string;
  sender: string;
  timestamp: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender, timestamp }) => {
  return (
    <div className='flex flex-col my-2'>
      <p className='font-light text-sm'>{timestamp}</p>
      <div className='flex flex-row'>
        <p className='font-bold'>{sender}: &nbsp;</p>
        <p className=''>{message}</p>
      </div>
    </div>
  );
};

export default ChatMessage;