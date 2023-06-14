import { NextResponse } from "next/server";
import getCurrentUser from "../../actions/getCurrentUser";
import client from "../../libs/prismadb";
import { pusherServer } from "../../libs/pusher";

export async function POST(request: Request) {
	try {
		const currentUser = await getCurrentUser();
		const body = await request.json();
		const { userId, isGroup, members, name } = body;

		if (!currentUser?.id || !currentUser?.email) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		// check invalid group chat
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
						connect: [
							// create array of users group chat
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

			// sent create conversation to all users in group chat
			newConversations.users.forEach((user) => {
				if (user.email) {
					pusherServer.trigger(
						user.email,
						"conversation:new",
						newConversations
					);
				}
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
		const arrIds = [currentUser.id, userId];
		const arrIdsSorted = arrIds.sort((a, b) =>
			b.toString().localeCompare(a.toString())
		);

		const newConversation = await client.conversation.create({
			data: {
				users: {
					connect: [
						// connect to create array of users relationship
						{
							id: currentUser.id,
						},
						{
							id: userId,
						},
					],
				},
				idsUnique: arrIdsSorted.join("-"),
			},
			include: {
				users: true,
			},
		});

		// sent create conversation to all users in individual chat
		newConversation.users.forEach((user) => {
			if (user.email) {
				pusherServer.trigger(user.email, "conversation:new", newConversation);
			}
		});

		return NextResponse.json(newConversation);
	} catch (error) {
		console.log(error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
