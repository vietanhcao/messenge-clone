import client from "../libs/prismadb";

const getMessengers = async (conversationId: string) => {
	// todo skip limit
	try {
		const messengers = await client.message.findMany({
			orderBy: {
				createdAt: "asc",
			},
			take: 50, // limit
			skip: 0, // offset
			where: {
				conversationId: conversationId,
			},
			include: {
				sender: true,
				seen: true,
			},
		});

		return messengers;
	} catch (error) {
		return [];
	}
};

export default getMessengers;
