import getCurrentUser from "../../actions/getCurrentUser";
import ActiveStatus from "../ActiveStatus";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";

async function Sidebar({ children }: { children: React.ReactNode }) {
	const currentUser = await getCurrentUser();
	return (
		<div className="h-full">
			<ActiveStatus />
			<DesktopSidebar currentUser={currentUser!} />
			<MobileFooter />
			<main className="lg:pl-20 h-full"> {children}</main>
		</div>
	);
}

export default Sidebar;
