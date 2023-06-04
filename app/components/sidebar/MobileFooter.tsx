"use client";

import useConversation from "../../hooks/useConversation";
import useRoutes from "../../hooks/useRoutes";
import Mobileitem from "./Mobileitem";

const MobileFooter = () => {
	const routes = useRoutes();
	const { isOpen } = useConversation();

	if (isOpen) return null;

	return (
		<div
			className="
      fixed
      justify-between
      w-full
      bottom-0
      z-40
      flex
      items-center
      bg-white
      border-t-[1px]
      lg:hidden
    "
		>
			{routes.map((route) => {
				return (
					<Mobileitem
						key={route.lable}
						label={route.lable}
						href={route.href}
						active={route.active}
						icon={route.icon}
						onClick={route.onClick}
					/>
				);
			})}
		</div>
	);
};

export default MobileFooter;