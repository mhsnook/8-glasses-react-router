import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { useState } from 'react'

export function Layout() {
	const [sidebarOpen, setSidebarOpen] = useState(false)

	return (
		<div className="flex min-h-screen bg-gray-50">
			<Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
			
			<div className="flex flex-1 flex-col">
				<Navbar onMenuClick={() => setSidebarOpen(true)} />
				<main className="flex-1 p-4 sm:p-6 md:p-8">
					<Outlet />
				</main>
			</div>
		</div>
	)
}