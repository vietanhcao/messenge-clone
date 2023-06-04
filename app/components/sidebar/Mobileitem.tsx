"use client";

import clsx from "clsx";
import Link from "next/link";

interface MobileitemProps {
	label: string;
	icon: any;
	href: string;
	onClick: (() => void) | undefined;
	active?: boolean;
}

const Mobileitem: React.FC<MobileitemProps> = ({
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
		<Link
			href={href}
			className={clsx(
				`
        group
        flex
        gap-x-3
        rounded-md
        p-4
        text-sm
        justify-center
        w-full
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
			<Icon className="h-6 w-6 shrink-0"></Icon>
		</Link>
	);
};

export default Mobileitem;
