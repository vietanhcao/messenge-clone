"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import useConversation from "../../../hooks/useConversation";
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
