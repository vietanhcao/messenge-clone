import getConversations from "../actions/getConversations";
import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationsList from "./components/ConversationsList";

export default async function ConversationsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const conversations = await getConversations();
	const users = await getUsers();
	return (
		//@ts-expect-error Server Component
		<Sidebar>
			<div className="h-full">
				<ConversationsList initialItems={conversations} users={users} />
				{children}
			</div>
		</Sidebar>
	);
}
