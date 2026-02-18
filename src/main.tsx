import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@/index.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import AppRouter from "@/AppRouter"
import { Toaster } from "./components/ui/sonner"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<AppRouter />
			<Toaster richColors theme="light" />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</StrictMode>,
)
