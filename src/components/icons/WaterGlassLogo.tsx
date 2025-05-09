import { cn } from '../../lib/utils'

interface WaterGlassLogoProps {
	className?: string
}

export function WaterGlassLogo({ className }: WaterGlassLogoProps) {
	return (
		<div className={cn('relative', className)}>
			<svg
				viewBox="0 0 32 32"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="h-full w-full"
			>
				<rect
					width="32"
					height="32"
					rx="6"
					fill="currentColor"
					className="text-primary-500"
				/>
				<path
					d="M10 8H22V24C22 25.1046 21.1046 26 20 26H12C10.8954 26 10 25.1046 10 24V8Z"
					fill="white"
					fillOpacity="0.5"
				/>
				<path
					d="M14 12C14 12 13 14 13 15C13 16 14 16 14 17C14 18 13 20 13 20"
					stroke="white"
					strokeWidth="1.5"
					strokeLinecap="round"
					className="animate-wave"
				/>
				<path
					d="M18 14C18 14 17 16 17 17C17 18 18 18 18 19C18 20 17 22 17 22"
					stroke="white"
					strokeWidth="1.5"
					strokeLinecap="round"
					className="animate-wave [animation-delay:300ms]"
				/>
				<path
					d="M8 9H24"
					stroke="white"
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
			</svg>
			
			{/* Animated droplets */}
			<div className="absolute -bottom-1 left-1/4 h-1.5 w-1.5 rounded-full bg-blue-100 opacity-0 animate-droplet"></div>
			<div className="absolute -bottom-1 right-1/4 h-1.5 w-1.5 rounded-full bg-blue-100 opacity-0 animate-droplet [animation-delay:1s]"></div>
		</div>
	)
}