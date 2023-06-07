"use client";

import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import Avatar from "../../components/Avatar";
import { UserGettedType } from "../../types";

interface UserBoxProps {
	data: UserGettedType;
}

const UserBox: React.FC<UserBoxProps> = ({ data }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleClick = useCallback(() => {
		setIsLoading(true);
		axios
			.post("/api/conversations", { userId: data.id })
			.then((data) => {
				router.push(`/conversations/${data.data.id}`);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [data, router]);

	return (
		<div
			onClick={handleClick}
			className="
				w-full
				realtive
				flex
				items-center
				space-x-3
				bg-white
				p-3
				hover:bg-neutral-100
				cursor-pointer
				rounded-lg
				transition
			"
		>
			<Avatar user={data} />
			<div className="flex-1 min-h-0">
				<div className="focus:outline-none">
					<div
						className="
						flex
						items-center
						justify-between
						mb-1
						"
					>
						<p className="text-sm font-medium text-gray-900"> {data.name}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserBox;