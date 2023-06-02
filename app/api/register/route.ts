import bcript from "bcrypt";

import client from "../../libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();

		const { email, password, name } = body;

		if (!email || !password || !name)
			return new NextResponse("Missing infor", { status: 400 });

		const hashedPassword = await bcript.hash(password, 12);

		const user = await client.user.findUnique({
			where: {
				email,
			},
		});

		if (user) return new NextResponse("Email already exited", { status: 400 });

		const createdUser = await client.user.create({
			data: {
				email,
				hashedPassword,
				name,
			},
		});

		return NextResponse.json(createdUser);
	} catch (error) {
		console.log("error Registration", error);
		return new NextResponse("Something went wrong", { status: 500 });
	}
}
