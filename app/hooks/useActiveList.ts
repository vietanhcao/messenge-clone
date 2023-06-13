import { create } from "zustand";

interface ActiveListStore {
	members: string[]; // list memberId
	add: (id: string) => void;
	remove: (id: string) => void;
	set: (ids: string[]) => void;
}

const useActiveList = create<ActiveListStore>((set) => ({
	members: [],
	add: (id) =>
		set((state) => {
			if (state.members.includes(id)) return state;
			return { members: [...state.members, id] };
		}),
	remove: (id) =>
		set((state) => ({
			members: state.members.filter((memberId) => memberId !== id),
		})),
	set: (ids) => set({ members: ids }),
}));

export default useActiveList;
