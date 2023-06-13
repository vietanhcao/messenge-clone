"use client";

import { User } from "@prisma/client";
import { useState } from "react";

import useRoutes from "../../hooks/useRoutes";
import Avatar from "../Avatar";
import DesktopItem from "./Desktopitem";
import SettingModal from "./SettingModal";

interface DesktopSidebarProps {
	currentUser: User;
}

const DesktiopSidebar: React.FC<DesktopSidebarProps> = ({ currentUser }) => {
	const routes = useRoutes();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<SettingModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				currentUser={currentUser}
			/>
			<div
				className="
					hidden
					lg:fixed
					lg:inset-y-0
					lg:left-0
					lg:z-40
					lg:w-20
					xl:px-6
					lg:overflow-y-auto
					lg:bg-white
					lg:border-r-[1px]
					lg:pb-4
					lg:flex
					lg:flex-col
					justify-between
				"
			>
				<nav
					className="
						mt-4
						flex
						flex-col
						justify-between
					"
				>
					<ul
						role={"list"}
						className="
							flex
							flex-col
							items-center
							space-y-1
          "
					>
						{routes.map((item) => {
							return (
								<DesktopItem
									key={item.lable}
									href={item.href}
									label={item.lable}
									icon={item.icon}
									active={item.active}
									onClick={item.onClick}
								/>
							);
						})}
					</ul>
				</nav>
				<nav
					className="
					flex
					flex-col
					items-center
					justify-center
					mt-4
				"
				>
					<div
						onClick={() => setIsOpen(true)}
						className="
						cursor-pointer
						hover:opacity-75
						transition
					"
					>
						<Avatar user={currentUser} />
					</div>
				</nav>
			</div>
		</>
	);
};

export default DesktiopSidebar;
