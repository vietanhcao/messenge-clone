"use client";
import clsx from "clsx";
import { IconType } from "react-icons";

interface AuthSocialButtonProps {
	icon: IconType;
	onClick: () => void;
	disabled?: boolean;
}

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
	icon: Icon,
	onClick,
	disabled = false,
}) => {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			type="button"
			className={clsx(
				`
        inline-flex
        w-full
        justify-center
        roaunded-md
        bg-white
        px-4
        py-2
        text-gray-500
        showdow-sm
        ring-1
        ring-inset
        ring-gray-300
        hover:bg-gray-50
        focus:outline-offset-0
      `,
				disabled && "opacity-50 cursor-not-allowed"
			)}
		>
			<Icon />
		</button>
	);
};

export default AuthSocialButton;
