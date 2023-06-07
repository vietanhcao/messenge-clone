import getConversationById from "../../actions/getConversationById";
import getMessengers from "../../actions/getMessengers";
import EmptyState from "../../components/EmptyState";
import Body from "./components/Body";
import Form from "./components/Form";
import Header from "./components/Header";

interface IParams {
	conversationId: string;
}

const ConversationId = async ({ params }: { params: IParams }) => {
	const conversation = await getConversationById(params.conversationId);
	const messenges = await getMessengers(params.conversationId);

	if (!conversation) {
		return (
			<div className="lg:pl-80 h-full">
				<div className="h-full fex flex-col">
					<EmptyState />
				</div>
			</div>
		);
	}

	return (
		<div className="lg:pl-80 h-full">
			<div className="h-full flex flex-col">
				<Header conversation={conversation} />
				<Body initialMessenges={messenges} />
				<Form />
			</div>
		</div>
	);
};

export default ConversationId;
