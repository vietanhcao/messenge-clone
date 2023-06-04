import Sidebar from "../components/sidebar/Sidebar";

// layout to wrap all user pages
export default async function UsersLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		//@ts-expect-error Server Component
		<Sidebar>
			<div className="h-full">{children}</div>
		</Sidebar>
	);
}
