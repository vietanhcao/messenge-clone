"use client";

import axios from "axios";
import { find } from "lodash";
import { useEffect, useRef, useState } from "react";
import useConversation from "../../../hooks/useConversation";
import { pusherClient } from "../../../libs/pusher";
import { FullMessageType } from "../../../types";
import MessageBox from "./MessageBox";

interface BodyProps {
	initialMessenges: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessenges }) => {
	const [messages, setMessages] = useState<FullMessageType[]>(initialMessenges);
	const bottomRef = useRef<HTMLDivElement>(null);

	const { conversationId } = useConversation();

	useEffect(() => {
		axios.post(`/api/conversations/${conversationId}/seen`);
	}, [conversationId]);

	useEffect(() => {
		pusherClient.subscribe(conversationId); // subscribe to the channel
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });

		// update new message
		const messageHandler = (message: FullMessageType) => {
			axios.post(`/api/conversations/${conversationId}/seen`);
			// use lodash
			setMessages((current) => {
				const _message = find(current, { id: message.id });
				if (_message) return current;

				return [...current, message];
			});

			bottomRef.current?.scrollIntoView({ behavior: "smooth" });
		};

		// update seen status message
		const updateMessageHandler = (newMessage: FullMessageType) => {
			setMessages((current) =>
				current.map((currentMessage) => {
					if (currentMessage.id === newMessage.id) return newMessage;
					return currentMessage;
				})
			);
		};

		// listen for new messages
		pusherClient.bind("message:new", messageHandler);
		pusherClient.bind("message:update", updateMessageHandler);

		return () => {
			pusherClient.unsubscribe(conversationId);
			pusherClient.unbind("message:new", messageHandler);
			pusherClient.unbind("message:update", updateMessageHandler);
		};
	}, [conversationId]);

	return (
		<div className="flex-1 overflow-y-auto">
			{messages.map((message, i) => (
				<MessageBox
					isLast={i === messages.length - 1}
					key={message.id}
					data={message}
				/>
			))}
			<div className="pt-24" ref={bottomRef}></div>
		</div>
	);
};

export default Body;
