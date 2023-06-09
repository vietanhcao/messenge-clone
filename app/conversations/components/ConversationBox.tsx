"use client";

import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import Avatar from "../../components/Avatar";
import AvatarGroup from "../../components/AvatarGroup";
import useOtherUser from "../../hooks/useOtherUser";
import { FullConversationType } from "../../types";

interface ConversationBoxProps {
	data: FullConversationType;
	selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
	data,
	selected,
}) => {
	const otherUser = useOtherUser(data);
	const session = useSession();
	const router = useRouter();

	const handleClick = useCallback(() => {
		router.push(`/conversations/${data.id}`);
	}, [data.id, router]);

	const lastMessage = useMemo(() => {
		const messages = data.messages || [];
		return messages[messages.length - 1];
	}, [data.messages]);

	const userEmail = useMemo(() => {
		return session?.data?.user?.email;
	}, [session?.data?.user?.email]);

	const hasSeen = useMemo(() => {
		if (!lastMessage) return false;
		const seenArray = lastMessage.seen || [];

		if (!userEmail) return false;

		// check at least one user has seen the message
		return (
			seenArray.filter((user) => {
				return user.email === userEmail;
			}).length !== 0
		);
	}, [lastMessage, userEmail]);

	const lastMessageText = useMemo(() => {
		if (lastMessage?.image) {
			return "Sent an image";
		}
		if (lastMessage?.body) return lastMessage.body;

		return "Started a conversation";
	}, [lastMessage]);

	return (
		<div
			onClick={handleClick}
			className={clsx(
				`
        w-full
        flex
        relative
        items-center
        space-x-3
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
        p-3
      `,
				selected ? "bg-neutral-100" : "bg-white"
			)}
		>
			{data.isGroup ? (
				<AvatarGroup users={data.users} />
			) : (
				<Avatar user={otherUser} />
			)}

			<div className="min-w-0 flex-1">
				<div className="focus:outline-none">
					<div
						className="
              flex
              justify-between
              items-center
              mb-1
            "
					>
						<p
							className="
              text-md
              font-medium
              text-gray-900
            "
						>
							{data.name || otherUser?.name}
						</p>
						{lastMessage?.createdAt && (
							<p
								className="
                text-sm
                text-gray-400
                font-light
              "
							>
								{format(new Date(lastMessage.createdAt), "p")}
							</p>
						)}
					</div>
					<p
						className={clsx(
							`
              truncate
              text-sm
            `,
							hasSeen ? "text-gray-500" : "text-black font-medium"
						)}
					>
						{lastMessageText}
					</p>
				</div>
			</div>
		</div>
	);
};

export default ConversationBox;
