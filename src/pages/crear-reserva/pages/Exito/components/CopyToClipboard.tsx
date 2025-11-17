"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface CopyToClipboardProps {
	textToCopy: string
}

export function CopyToClipboard({ textToCopy }: CopyToClipboardProps) {
	const [isCopied, setIsCopied] = useState(false)

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(textToCopy)
			setIsCopied(true)
			setTimeout(() => setIsCopied(false), 2000)
		} catch (err) {
			console.error("Failed to copy text: ", err)
		}
	}

	return (
		<Button
			onClick={handleCopy}
			variant="outline"
			size="sm"
			className="flex items-center gap-2 bg-muted cursor-pointer"
		>
			<span className="font-mono text-sm">{textToCopy}</span>
			{isCopied ? (
				<Check className="h-4 w-4 text-green-500" />
			) : (
				<Copy className="h-4 w-4 text-muted-foreground" />
			)}
		</Button>
	)
}

export default CopyToClipboard
