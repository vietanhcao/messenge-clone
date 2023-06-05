import { NextResponse } from "next/server";
import getCurrentUser from "../../actions/getCurrentUser";
import client from "../../libs/prismadb";

export async function POST(request: Request) {
	try {
		const currentUser = await getCurrentUser();
		const body = await request.json();
		const { userId, isGroup, members, name } = body;

		if (!currentUser?.id || !currentUser?.email) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		// ??? What is this for?
		if (isGroup && (!members || members.length < 2 || !name)) {
			return new NextResponse("Invalid data", { status: 400 });
		}

		// group chat
		if (isGroup) {
			const newConversations = await client.conversation.create({
				data: {
					name,
					isGroup,
					users: {
						connect: [//??
							...members.map((member: { value: string }) => ({
								id: member.value,
							})),
							{
								id: currentUser.id,
							},
						],
					},
				},
				include: {
					// populate the users field
					users: true,
				},
			});

			return NextResponse.json(newConversations);
		}

		// single chat
		const existingConversations = await client.conversation.findMany({
			// only find many supports where
			where: {
				OR: [
					{
						userIds: {
							equals: [currentUser.id, userId],
						},
					},
					{
						userIds: {
							equals: [userId, currentUser.id],
						},
					},
				],
			},
		});

		const singleConversation = existingConversations[0];
		if (singleConversation) {
			return NextResponse.json(singleConversation);
		}

		const newConversation = await client.conversation.create({
			data: {
				users: {
					connect: [ // connect to create array of users relationship
						{
							id: currentUser.id,
						},
						{
							id: userId,
						},
					],
				},
			},
			include: {
				users: true,
			},
		});
		return NextResponse.json(newConversation);
	} catch (error) {
		return new NextResponse("Internal Error", { status: 500 });
	}
}
