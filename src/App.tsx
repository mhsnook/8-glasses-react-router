import { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { ToastProvider } from './components/ui/toaster'
import { useAuth } from './contexts/AuthContext'
import { Dashboard } from './pages/Dashboard'
import { GoalDetails } from './pages/GoalDetails'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Profile } from './pages/Profile'
import { PublicGoal } from './pages/PublicGoal'
import { PublicProfile } from './pages/PublicProfile'
import { Register } from './pages/Register'
import { Stats } from './pages/Stats'

function App() {
	const { user, isLoading } = useAuth()
	const navigate = useNavigate()
	const location = useLocation()

	useEffect(() => {
		// Check authentication status and redirect if needed
		if (!isLoading) {
			const authRoutes = ['/login', '/register']
			const isAuthRoute = authRoutes.includes(location.pathname)

			if (!user && !isAuthRoute) {
				navigate('/login')
			} else if (user && isAuthRoute) {
				navigate('/')
			}
		}
	}, [user, isLoading, location.pathname, navigate])

	// Show loading state
	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="text-center">
					<div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em]"></div>
					<p className="text-lg font-medium text-secondary-600">Loading...</p>
				</div>
			</div>
		)
	}

	return (
		<ToastProvider>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/g/:goalId" element={<PublicGoal />} />
				<Route path="/u/:username" element={<PublicProfile />} />
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="stats" element={<Stats />} />
					<Route path="profile" element={<Profile />} />
					<Route path="goals/:goalId" element={<GoalDetails />} />
				</Route>
			</Routes>
		</ToastProvider>
	)
}

export default App