"use client";

import { Conversation } from "@prisma/client";
import { FullConversationType } from "../../types";

interface ConversationsListProps {
	initialItems: FullConversationType[];
}

const ConversationsList: React.FC<ConversationsListProps> = ({ initialItems }) => {

  // todo - implement this component
	return <div>ConversationsList</div>;
};

export default ConversationsList;
