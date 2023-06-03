"use client";

import clsx from "clsx";
import Link from "next/link";

interface DesktopItemProps {
	label: string;
	icon: any;
	href: string;
	onClick: (() => void) | undefined;
	active?: boolean;
}

const DesktopItem: React.FC<DesktopItemProps> = ({
	label,
	icon: Icon,
	href,
	onClick,
	active,
}) => {
	const handleClick = () => {
		if (onClick) return onClick();
	};

	return (
		<li
			className={clsx(
				`
        flex
        group
        gap-x-3
        rounded-md
        px-3
        text-sm
        leading-6
        font-semibold
        text-gray-500
        hover:text-black
        hover:bg-gray-100
       `,
				active && "bg-gray-100 text-black"
			)}
			onClick={handleClick}
		>
			<Link href={href}>
				<Icon className="h-6 w-6 shrink-0"></Icon>
				<span className="sr-only">{label}</span>
			</Link>
		</li>
	);
};

export default DesktopItem;
