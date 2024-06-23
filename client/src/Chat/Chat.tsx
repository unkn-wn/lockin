import ChatMessage from './ChatMessage'

type Props = {
    messages: { text: string; sender: string; timestamp: string; }[],
    messagesEndRef: React.RefObject<HTMLDivElement>
}

export default function Chat({ messages, messagesEndRef }: Props) {
    return (
        <>
            <div className="overflow-y-auto h-full pr-6">
                {messages.map((message, index) => (
                    <ChatMessage
                        key={index}
                        message={message.text}
                        sender={message.sender}
                        timestamp={message.timestamp}
                    />
                ))}

                <div ref={messagesEndRef} />
            </div>
        </>
    )

}