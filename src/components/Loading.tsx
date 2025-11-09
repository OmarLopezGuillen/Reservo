import { Spinner } from "@/components/ui/spinner"

export const Loading = () => {
	return (
		<div className="h-dvh flex justify-center items-center">
			<Spinner className="size-8" />
		</div>
	)
}
