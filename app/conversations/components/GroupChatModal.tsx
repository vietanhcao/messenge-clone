"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Button from "../../components/Button";
import { Input } from "../../components/inputs/Input";
import Select from "../../components/inputs/Select";
import Modal from "../../components/Modal";
import { UserGettedType } from "../../types";

interface GroupChatModalProps {
	isOpen: boolean;
	onClose: () => void;
	users: UserGettedType[];
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({
	isOpen,
	onClose,
	users,
}) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		reset,
	} = useForm<FieldValues>({
		defaultValues: {
			name: "",
			members: [],
		},
	});

	const members = watch("members");

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		setIsLoading(true);
		axios
			.post("/api/conversations", { ...data, isGroup: true })
			.then((res) => {
				router.refresh();
				reset();
				onClose();
			})
			.catch((err) => {
				toast.error("Something went wrong!");
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {
				reset();
				onClose();
			}}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="space-y-12">
					<div className="border-b border-gray-900/10 pb-12">
						<h2
							className="
                text-base
                font-semibold
                leading-7
                text-gray-900
                "
						>
							Create a group chat
						</h2>
						<p
							className="
              mt-1
              text-sm
              text-gray-600
              leading-6
            "
						>
							create chat with more than 2 people
						</p>
						<div
							className="
                mt-10
                flex
                flex-col
                gap-y-8
              "
						>
							<Input
								register={register}
								label={"Name"}
								id={"name"}
								disabled={isLoading}
								required
								errors={errors}
							/>
							<Select
								disabled={isLoading}
								label={"Members"}
								options={users.map((user) => ({
									value: user.id,
									label: user.name,
								}))}
								onChange={(value) => {
									setValue("members", value, { shouldValidate: true });
								}}
								value={members}
							/>
						</div>
					</div>
				</div>
				<div className="mt-6 flex justify-end items-center gap-x-6">
					<Button
						disabled={isLoading}
						type="button"
						onClick={onClose}
						secondary
					>
						Cancel
					</Button>
					<Button disabled={isLoading} type="submit">
						Create
					</Button>
				</div>
			</form>
		</Modal>
	);
};

export default GroupChatModal;
