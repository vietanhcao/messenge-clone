import client from "../libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversations = async () => {
	const currentUser = await getCurrentUser();
	if (!currentUser?.id || !currentUser?.email) {
		return [];
	}
	try {
		const conversations = await client.conversation.findMany({
			orderBy: {
				lastMessageAt: "desc",
			},
			where: {
				userIds: {
					has: currentUser.id,
				},
			},
			include: {
				// populate the users field
				users: true,
				messages: {
					include: {
						sender: true,
						seen: true,
					},
				},
			},
		});

		return conversations;
	} catch (error) {
		return [];
	}
};

export default getConversations;
