"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import useActiveList from "../hooks/useActiveList";
import { UserGettedType } from "../types";

interface AvatarProps {
	user?: UserGettedType;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
	const { members } = useActiveList();
	console.log("members", members);
	const isActive = members.includes(user!.email);
	return (
		<div className="relative">
			<div
				className="
          relative
          inline-block
          rounded-full
          overflow-hidden
          h-9
          w-9
          md:h-11
          md:w-11
        "
			>
				<Image
					src={user?.image || "/images/placeholder.jpg"}
					alt="avatar"
					fill
				/>
			</div>
			{isActive && (
				<span
					className="
          absolute
          block
          rounded-full
          bg-green-500
          ring-2
          ring-white
          top-0
          right-0
          h-2
          w-2
          md:h-3
          md:w-3
        "
				></span>
			)}
		</div>
	);
};

export default Avatar;
