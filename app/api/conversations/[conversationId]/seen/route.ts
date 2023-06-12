import { NextResponse } from "next/server";
import getCurrentUser from "../../../../actions/getCurrentUser";
import client from "../../../../libs/prismadb";
import { pusherServer } from "../../../../libs/pusher";

interface IParams {
	conversationId: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
	try {
		const currentUser = await getCurrentUser();
		const { conversationId } = params;
		if (!currentUser?.id || !currentUser?.email) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
		// Find the existing conversation
		const conversation = await client.conversation.findUnique({
			where: {
				id: conversationId,
			},
			include: {
				messages: {
					include: {
						seen: true,
					},
				},
				users: true,
			},
		});

		if (!conversation) {
			return new NextResponse("Invalid Id", { status: 400 });
		}

		// find the last message
		const lastMessage = conversation.messages[conversation.messages.length - 1];

		if (!lastMessage) {
			return NextResponse.json(conversation);
		}

		// update seen of last message
		const updatedMessage = await client.message.update({
			where: {
				id: lastMessage.id,
			},
			data: {
				seen: {
					connect: {
						id: currentUser.id,
					},
				},
			},
			include: {
				sender: true,
				seen: true,
			},
		});

		// update conversation
		await pusherServer.trigger(currentUser.email, "conversation:update", {
			id: conversation.id,
			messages: [updatedMessage],
		});

		// if current user already seen the message
		if (lastMessage.seenIds.includes(currentUser.id)) {
			return NextResponse.json(conversation);
		}

		// sent to all users in conversation to update seen
		await pusherServer.trigger(
			conversationId,
			"message:update",
			updatedMessage
		);

		return NextResponse.json(updatedMessage);
	} catch (error) {
		console.log("seen massage", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
