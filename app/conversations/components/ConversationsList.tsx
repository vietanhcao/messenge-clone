"use client";

import { User } from "@prisma/client";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import useConversation from "../../hooks/useConversation";
import { FullConversationType, UserGettedType } from "../../types";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";

interface ConversationsListProps {
	initialItems: FullConversationType[];
	users: UserGettedType[];
}

const ConversationsList: React.FC<ConversationsListProps> = ({
	initialItems,
	users,
}) => {
	const [items, setItems] = useState<FullConversationType[]>(initialItems);
	const [isModelOpen, setIsModelOpen] = useState(false);

	const router = useRouter();

	const { conversationId, isOpen } = useConversation();
	return (
		<>
			<GroupChatModal
				isOpen={isModelOpen}
				onClose={() => setIsModelOpen(false)}
				users={users}
			/>
			<aside
				className={clsx(
					`
					fixed
					inset-y-0
					pb-20
					lg:pb-0
					lg:left-20
					lg:w-80
					lg:block
					overflow-y-auto
					border-r
					border-gray-200
				`,
					isOpen ? "hidden" : "block w-full left-0"
				)}
			>
				<div className="px-5">
					<div className="flex justify-between mb-4 pt-4">
						<div className="text-2xl font-bold text-neutral-800">Messenger</div>
						<div
							onClick={() => setIsModelOpen(true)}
							className="
              rounded-full 
              p-2
               bg-gray-100 
              cursor-pointer
              hover:opacity-75
              text-gray-800
              transition"
						>
							<MdOutlineGroupAdd size={20} />
						</div>
					</div>
					{items.map((item) => {
						return (
							<ConversationBox
								key={item.id}
								data={item}
								selected={conversationId === item.id}
							/>
						);
					})}
				</div>
			</aside>
		</>
	);
};

export default ConversationsList;
