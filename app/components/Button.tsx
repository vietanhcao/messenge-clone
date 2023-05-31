"use client";

import clsx from "clsx";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface ButtonProps {
	type?: "button" | "submit" | "reset" | undefined;
	fullWidth?: boolean;
	children: React.ReactNode;
	onClick?: () => void;
	secondary?: boolean;
	danger?: boolean;
	disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
	type = "button",
	fullWidth = false,
	children,
	onClick,
	secondary = false,
	danger = false,
	disabled = false,
}) => {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={clsx(
				`
      flex
      justify-center
      rounded-md
      px-3
      py-2
      text-sm
      font-semibold
      focus-visible:outline
      focus-visible:outline-2
      focus-visible:out 
      `,
				disabled && "opacity-50 cursor-not-allowed",
				fullWidth && "w-full",
				secondary ? "text-gray-900" : "text-white",
				danger &&
					"bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600",
				!secondary &&
					!danger &&
					"bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600"
			)}
		>
			{children}
		</button>
	);
};

export default Button;
