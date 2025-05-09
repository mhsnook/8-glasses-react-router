import {
	BarChart3,
	ChevronLeft,
	Home,
	LogOut,
	Plus,
	Settings,
	Target,
	User,
	X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../lib/utils'
import { WaterGlassLogo } from '../icons/WaterGlassLogo'
import { CreateGoalDialog } from '../goals/CreateGoalDialog'

interface SidebarProps {
	isOpen: boolean
	setIsOpen: (open: boolean) => void
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
	const { signOut } = useAuth()
	const [createGoalOpen, setCreateGoalOpen] = useState(false)
	const location = useLocation()

	// Close sidebar on route change on mobile
	useEffect(() => {
		if (isOpen) {
			setIsOpen(false)
		}
	}, [location.pathname])

	const navItems = [
		{
			name: 'Home',
			href: '/',
			icon: Home,
		},
		{
			name: 'Dashboard',
			href: '/dashboard',
			icon: Target,
		},
		{
			name: 'Statistics',
			href: '/stats',
			icon: BarChart3,
		},
		{
			name: 'Profile',
			href: '/profile',
			icon: User,
		},
		{
			name: 'Settings',
			href: '/settings',
			icon: Settings,
		},
	]

	return (
		<>
			{/* Mobile sidebar backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 z-40 bg-secondary-950/50 lg:hidden"
					onClick={() => setIsOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={cn(
					'fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
					isOpen ? 'translate-x-0' : '-translate-x-full'
				)}
			>
				<div className="flex h-full flex-col border-r border-secondary-200">
					{/* Sidebar header */}
					<div className="flex h-16 items-center justify-between border-b border-secondary-200 px-4">
						<Link to="/" className="flex items-center">
							<WaterGlassLogo className="h-8 w-8" />
							<span className="ml-2 text-xl font-bold text-primary-600">
								Eight Glasses
							</span>
						</Link>
						<button
							onClick={() => setIsOpen(false)}
							className="rounded-lg p-1.5 text-secondary-500 hover:bg-secondary-100 lg:hidden"
						>
							<X className="h-5 w-5" />
						</button>
					</div>

					{/* Create goal button */}
					<div className="p-4">
						<button
							onClick={() => setCreateGoalOpen(true)}
							className="btn btn-primary w-full"
						>
							<Plus className="h-4 w-4" />
							<span>Create New Goal</span>
						</button>
					</div>

					{/* Navigation */}
					<nav className="flex-1 space-y-1 px-2 py-4">
						{navItems.map((item) => (
							<NavLink
								key={item.name}
								to={item.href}
								className={({ isActive }) =>
									cn(
										'flex items-center rounded-lg px-2 py-2 text-base font-medium',
										isActive
											? 'bg-primary-50 text-primary-600'
											: 'text-secondary-700 hover:bg-secondary-50'
									)
								}
							>
								<item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
								<span>{item.name}</span>
							</NavLink>
						))}
					</nav>

					{/* Sidebar footer */}
					<div className="border-t border-secondary-200 p-4">
						<button
							onClick={() => signOut()}
							className="flex w-full items-center rounded-lg px-2 py-2 text-base font-medium text-secondary-700 hover:bg-secondary-50"
						>
							<LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
							<span>Sign out</span>
						</button>
					</div>
				</div>
			</aside>

			{/* Collapse button */}
			<div className="fixed bottom-4 left-64 hidden transform lg:block">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-secondary-700 shadow-md hover:bg-secondary-50"
				>
					<ChevronLeft className="h-5 w-5" />
				</button>
			</div>

			{/* Create goal dialog */}
			<CreateGoalDialog open={createGoalOpen} setOpen={setCreateGoalOpen} />
		</>
	)
}