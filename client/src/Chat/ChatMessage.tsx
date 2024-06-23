import React from 'react';

interface ChatMessageProps {
    message: string;
    context?: string;
    sender: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, context, sender }) => {
    return (
        <div className='flex flex-col my-2'>
            {sender === 'user' ?
                (
                    <>
                        <div className='flex justify-end '>
                            <div className='flex flex-col w-10/12 bg-zinc-100 rounded-xl p-2'>
                                {/* <p className='font-light text-sm text-right'>{timestamp}</p> */}
                                <p className='text-right'>{message}</p>
                                <p className='text-right text-xs font-light text-zinc-500'>{context}</p>
                            </div>
                        </div>
                    </>
                ) :
                (
                    <>
                        {/* <p className='font-light text-sm'>{timestamp}</p> */}
                        <div className='flex flex-row'>
                            <p className='font-bold'>{'samantha'}: &nbsp;</p>
                            <p className=''>{message}</p>
                        </div>
                    </>
                )
            }


        </div>
    );
};

export default ChatMessage;