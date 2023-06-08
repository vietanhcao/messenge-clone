import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType, UserGettedType } from "../types";

const useOtherUser = (
	conversation:
		| FullConversationType
		| {
				users: UserGettedType[];
		  }
) => {
	const session = useSession();

	const otherUser = useMemo(() => {
		const currentUserEmail = session?.data?.user?.email;

		// find the other user in the conversation
		const otherUser = conversation.users.filter((user) => {
			return user.email !== currentUserEmail;
		});
		return otherUser[0];
	}, [session?.data?.user?.email, conversation.users]);

	return otherUser;
};

export default useOtherUser;
