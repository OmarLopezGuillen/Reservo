import type { BusinessData } from "@/models/business.model"
import type { ClubsRow } from "@/models/dbTypes"

export const clubsAdapterBase = (clubDB: ClubsRow): BusinessData => {
	return {
		id: clubDB.id,
		address: clubDB.address,
		phone: clubDB.phone,
		email: clubDB.email,
		name: clubDB.name,
		whatsappNumber: clubDB.whatsapp_number,
	}
}

export const clubsAdapter = (clubsDB: ClubsRow[]): BusinessData[] => {
	return clubsDB.map((club) => clubsAdapterBase(club))
}
