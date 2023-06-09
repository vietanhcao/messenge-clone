import { NextResponse } from "next/server";
import getCurrentUser from "../../actions/getCurrentUser";
import client from "../../libs/prismadb";

export async function POST(request: Request) {
	try {
		const currentUser = await getCurrentUser();
		const body = await request.json();
		const { name, image } = body;

		if (!currentUser) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const updatedUser = await client.user.update({
			where: {
				id: currentUser.id,
			},
			data: {
				image: image,
				name: name,
			},
		});

		return new NextResponse(JSON.stringify(updatedUser));
	} catch (error) {
		console.log("ERROR_SETTINGS_POST", error);
		return new NextResponse("Internal Server", { status: 500 });
	}
}
