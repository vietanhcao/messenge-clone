"use client";

import { User } from "@prisma/client";
import clsx from "clsx";
import { find } from "lodash";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import useConversation from "../../hooks/useConversation";
import { pusherClient } from "../../libs/pusher";
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
	const session = useSession();
	const [items, setItems] = useState<FullConversationType[]>(initialItems);
	const [isModelOpen, setIsModelOpen] = useState(false);

	const router = useRouter();

	const { conversationId, isOpen } = useConversation();

	const pusherKey = useMemo(() => {
		return session?.data?.user?.email;
	}, [session?.data?.user?.email]);

	useEffect(() => {
		if (!pusherKey) return;

		pusherClient.subscribe(pusherKey);

		const newConversationHandler = (conversation: FullConversationType) => {
			setItems((current) => {
				const _conversation = find(current, { id: conversation.id });
				if (_conversation) return current;

				return [conversation, ...current];
			});
		};

		const updateHandler = (conversation: FullConversationType) => {
			// find the conversation and update it
			setItems((current) =>
				current.map((currentConversation) => {
					if (currentConversation.id === conversation.id)
						return {
							...currentConversation,
							messages: conversation.messages,
						};
					return currentConversation;
				})
			);
		};

		const removeHandler = (conversation: FullConversationType) => {
			setItems((current) => {
				return current.filter((item) => item.id !== conversation.id);
			});
			if (conversationId === conversation.id) router.push("/conversations");
		};

		pusherClient.bind("conversation:new", newConversationHandler);
		pusherClient.bind("conversation:update", updateHandler);
		pusherClient.bind("conversation:remove", removeHandler);

		return () => {
			pusherClient.unsubscribe(pusherKey);
			pusherClient.unbind("conversation:new", newConversationHandler);
			pusherClient.unbind("conversation:update", updateHandler);
			pusherClient.unbind("conversation:remove", removeHandler);
		};
	}, [pusherKey, conversationId, router]);

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
