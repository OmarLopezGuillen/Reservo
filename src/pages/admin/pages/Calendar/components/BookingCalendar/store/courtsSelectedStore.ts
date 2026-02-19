import { create } from "zustand"

interface CourtsStore {
	courtsSelected: string[]
	setCourtsSelected: (courts: string[]) => void
}

export const useCourtsStore = create<CourtsStore>((set) => ({
	courtsSelected: [],

	setCourtsSelected: (courts) => set({ courtsSelected: courts }),
}))
