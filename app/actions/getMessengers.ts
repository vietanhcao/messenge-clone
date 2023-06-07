import client from "../libs/prismadb";

const getMessengers = async (conversationId: string) => {
	try {
		const messengers = await client.message.findMany({
			orderBy: {
				createdAt: "asc",
			},
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
