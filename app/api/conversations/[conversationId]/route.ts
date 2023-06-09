import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import getCurrentUser from "../../../actions/getCurrentUser";
import client from "../../../libs/prismadb";

interface IParams {
	conversationId: string;
}

export async function DELETE(
	req: NextApiRequest,
	{ params }: { params: IParams }
) {
	try {
		const { conversationId } = params;
		const currentUser = await getCurrentUser();
		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const existingConversations = await client.conversation.findUnique({
			where: {
				id: conversationId,
			},
			include: {
				users: true,
			},
		});

		if (!existingConversations) {
			return new NextResponse("Invalid Id", { status: 400 });
		}

		const dedetedConversation = await client.conversation.deleteMany({
			where: {
				id: conversationId,
				userIds: {
					hasSome: [currentUser.id],
				},
			},
		});

		return NextResponse.json(dedetedConversation);
	} catch (error) {
		console.log("ERROR_CONVERSATION_DELETE", error);
		return new NextResponse("Internal server error", { status: 500 });
	}
}
