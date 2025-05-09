import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { WaterGlassLogo } from '../components/icons/WaterGlassLogo'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/ui/toaster'

export function Login() {
	const { signIn } = useAuth()
	const { toast } = useToast()
	
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		
		try {
			const { error } = await signIn(email, password)
			
			if (error) {
				throw error
			}
		} catch (error) {
			console.error('Login error:', error)
			toast('Login failed. Please check your credentials.', 'error')
			setIsLoading(false)
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
			<div className="card max-w-md w-full">
				<div className="flex flex-col items-center p-8 text-center">
					<WaterGlassLogo className="mb-2 h-12 w-12" />
					<h1 className="text-2xl font-bold">Sign in to Eight Glasses</h1>
					<p className="mt-1 text-secondary-600">
						Track your habits and achieve your goals
					</p>
				</div>
				
				<div className="px-8 pb-8">
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label htmlFor="email" className="label">
								Email Address
							</label>
							<input
								id="email"
								type="email"
								autoComplete="email"
								required
								className="input"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						
						<div>
							<div className="flex items-center justify-between">
								<label htmlFor="password" className="label">
									Password
								</label>
							</div>
							<input
								id="password"
								type="password"
								autoComplete="current-password"
								required
								className="input"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						
						<button
							type="submit"
							className="btn btn-primary w-full"
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
									<span className="ml-2">Signing in...</span>
								</>
							) : (
								'Sign in'
							)}
						</button>
						
						<p className="text-center text-sm text-secondary-600">
							Don't have an account?{' '}
							<Link
								to="/register"
								className="font-medium text-primary-600 hover:text-primary-500"
							>
								Sign up
							</Link>
						</p>
					</form>
				</div>
			</div>
		</div>
	)
}