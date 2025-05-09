import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { WaterGlassLogo } from '../components/icons/WaterGlassLogo'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/ui/toaster'

export function Register() {
	const { signUp } = useAuth()
	const { toast } = useToast()
	
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [username, setUsername] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		
		// Simple validation
		if (username.length < 3) {
			toast('Username must be at least 3 characters long', 'error')
			setIsLoading(false)
			return
		}
		
		if (password.length < 6) {
			toast('Password must be at least 6 characters long', 'error')
			setIsLoading(false)
			return
		}
		
		try {
			const { error } = await signUp(email, password, username)
			
			if (error) {
				throw error
			}
			
			toast('Account created successfully!', 'success')
		} catch (error: any) {
			console.error('Registration error:', error)
			
			// Check for specific error types
			if (error.message?.includes('already')) {
				toast('An account with this email already exists.', 'error')
			} else {
				toast('Registration failed. Please try again.', 'error')
			}
			
			setIsLoading(false)
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
			<div className="card max-w-md w-full">
				<div className="flex flex-col items-center p-8 text-center">
					<WaterGlassLogo className="mb-2 h-12 w-12" />
					<h1 className="text-2xl font-bold">Create your account</h1>
					<p className="mt-1 text-secondary-600">
						Start tracking your habits with Eight Glasses
					</p>
				</div>
				
				<div className="px-8 pb-8">
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label htmlFor="username" className="label">
								Username
							</label>
							<input
								id="username"
								type="text"
								autoComplete="username"
								required
								className="input"
								placeholder="johndoe"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>
						
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
							<label htmlFor="password" className="label">
								Password
							</label>
							<input
								id="password"
								type="password"
								autoComplete="new-password"
								required
								className="input"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<p className="mt-1 text-xs text-secondary-500">
								Must be at least 6 characters long
							</p>
						</div>
						
						<button
							type="submit"
							className="btn btn-primary w-full"
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
									<span className="ml-2">Creating account...</span>
								</>
							) : (
								'Create account'
							)}
						</button>
						
						<p className="text-center text-sm text-secondary-600">
							Already have an account?{' '}
							<Link
								to="/login"
								className="font-medium text-primary-600 hover:text-primary-500"
							>
								Sign in
							</Link>
						</p>
					</form>
				</div>
			</div>
		</div>
	)
}