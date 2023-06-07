"use client";

import axios from "axios";
import { CldUploadButton } from "next-cloudinary";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import useConversation from "../../../hooks/useConversation";
import MessageInput from "./MessageInput";

const Form = () => {
	const { conversationId } = useConversation();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<FieldValues>({
		defaultValues: {
			message: "",
		},
	});

	// todo here
	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		setValue("message", "", { shouldValidate: true });
		axios.post(`/api/messages`, {
			...data,
			conversationId,
		});
	};

	const handleUpload = async (result: any) => {
		axios.post(`/api/messages`, {
			image: result?.info?.secure_url,
			conversationId,
		});
	};

	return (
		<div
			className="
				py-4
				px-4
				bg-white
				border-t
				flex
				items-center
				gap-2
				lg:gap-4
				w-full
			"
		>
			<CldUploadButton
				options={{ maxFiles: 1 }}
				onUpload={handleUpload}
				uploadPreset="bfatzi9b"
			>
				<HiPhoto size={30} className="text-sky-500" />
			</CldUploadButton>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex item-center gap-2 w-full lg:gap-4"
			>
				<MessageInput
					id="message"
					register={register}
					errors={errors}
					required
					placeholder="Write a message"
				/>
				<button
					type="submit"
					className="
					rounded-full
					p-2
					bg-sky-500
					hover:bg-sky-600
					transition
					cursor-pointer
				"
				>
					<HiPaperAirplane size={24} className="text-white" />
				</button>
			</form>
		</div>
	);
};

export default Form;
