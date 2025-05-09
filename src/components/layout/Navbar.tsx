import { Bell, Menu, UserCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { WaterGlassLogo } from '../icons/WaterGlassLogo'

interface NavbarProps {
	onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
	const { profile } = useAuth()

	return (
		<header className="border-b border-secondary-200 bg-white shadow-sm">
			<div className="flex h-16 items-center justify-between px-4 sm:px-6">
				<div className="flex items-center">
					<button
						onClick={onMenuClick}
						className="mr-4 rounded-lg p-2 text-secondary-600 hover:bg-secondary-100 lg:hidden"
					>
						<Menu className="h-6 w-6" />
					</button>
					
					<Link to="/" className="flex items-center">
						<WaterGlassLogo className="h-8 w-8" />
						<span className="ml-2 hidden text-xl font-bold text-primary-600 md:block">
							Eight Glasses
						</span>
					</Link>
				</div>

				<div className="flex items-center gap-2 sm:gap-4">
					<button className="rounded-full p-2 text-secondary-600 hover:bg-secondary-100">
						<Bell className="h-5 w-5" />
					</button>
					
					<Link
						to="/profile"
						className="flex items-center gap-2 rounded-full p-1 hover:bg-secondary-100"
					>
						{profile?.avatar_url ? (
							<img
								src={profile.avatar_url}
								alt={profile.username}
								className="h-8 w-8 rounded-full object-cover"
							/>
						) : (
							<UserCircle className="h-8 w-8 text-secondary-400" />
						)}
						<span className="hidden font-medium text-secondary-900 md:block">
							{profile?.username}
						</span>
					</Link>
				</div>
			</div>
		</header>
	)
}