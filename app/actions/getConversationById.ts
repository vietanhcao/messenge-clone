import client from "../libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversationById = async (conversationId: string) => {
	const currentUser = await getCurrentUser();
	if (!currentUser?.id || !currentUser?.email) {
		return null;
	}
	try {
		const conversation = await client.conversation.findUnique({
			where: {
				id: conversationId,
			},
			include: {
				// populate the users field "id" | "name" | "email" | "image" | "createdAt" | "updatedAt"
				users: {
					select: {
						id: true,
						email: true,
						name: true,
						image: true,
						createdAt: true,
						updatedAt: true,
					},
				},
				// messages: {
				// 	include: {
				// 		sender: true,
				// 		seen: true,
				// 	},
				// },
			},
		});

		return conversation;
	} catch (error) {
		return null;
	}
};

export default getConversationById;
