import { usePathname } from "next/navigation";
import { useMemo } from "react";
import useConversation from "./useConversation";
import { HiChat } from "react-icons/hi";
import { HiArrowLeftCircle, HiUser } from "react-icons/hi2";
import { signOut } from "next-auth/react";

const useRoutes = () => {
	const pathname = usePathname();
	const { conversationId } = useConversation();

	const routes = useMemo(
		() => [
			{
				lable: "Chat",
				href: "/conversations",
				icon: HiChat,
				active: pathname === "/conversations" || !!conversationId,
			},
			{
				lable: "Users",
				href: "/users",
				icon: HiUser,
				active: pathname === "/users",
			},
			{
				lable: "Logout",
				href: "#",
				onClick: () => {
					signOut();
				},
				icon: HiArrowLeftCircle,
			},
		],
		[pathname, conversationId]
	);
	return routes;
};

export default useRoutes;
