import { NextResponse } from "next/server";
import getCurrentUser from "../../actions/getCurrentUser";
import client from "../../libs/prismadb";
import { pusherServer } from "../../libs/pusher";

export async function POST(request: Request) {
	try {
		const currentUser = await getCurrentUser();
		const body = await request.json();
		const { message, image, conversationId } = body;

		if (!currentUser?.id || !currentUser?.email) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const newMessage = await client.message.create({
			data: {
				body: message,
				image,
				conversation: {
					connect: {
						id: conversationId,
					},
				},
				sender: {
					connect: {
						id: currentUser.id,
					},
				},
				seen: {
					// create array [(userId)]seen
					connect: {
						id: currentUser.id,
					},
				},
			},
			include: {
				seen: true,
				sender: true,
			},
		});

		const updatedConversation = await client.conversation.update({
			where: {
				id: conversationId,
			},
			data: {
				lastMessageAt: new Date(),
				messages: {
					// ?? why use connect here
					connect: {
						id: newMessage.id,
					},
				},
			},
			include: {
				users: true,
				messages: {
					include: {
						sender: true,
					},
				},
			},
		});

		await pusherServer.trigger(conversationId, "message:new", newMessage);

		const lastMessage =
			updatedConversation.messages[updatedConversation.messages.length - 1];

		// sent update conversation to all users in conversation 
		updatedConversation.users.map((user) => {
			pusherServer.trigger(user.email!, "conversation:update", {
				id: conversationId,
				messages: [lastMessage],
			});
		});

		return NextResponse.json(newMessage);
	} catch (error) {
		console.log("error Message", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
