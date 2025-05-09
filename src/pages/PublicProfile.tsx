import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
	GoalType,
	ProfileType,
	EntryType,
	calculateProgress,
	formatAmount,
} from '../lib/utils'
import { ArrowLeft, User } from 'lucide-react'

export function PublicProfile() {
	const { username } = useParams<{ username: string }>()
	
	const [profile, setProfile] = useState<ProfileType | null>(null)
	const [goals, setGoals] = useState<GoalType[]>([])
	const [entries, setEntries] = useState<EntryType[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [notFound, setNotFound] = useState(false)

	useEffect(() => {
		if (!username) return

		async function fetchProfileAndGoals() {
			setIsLoading(true)
			try {
				// Fetch profile
				const { data: profileData, error: profileError } = await supabase
					.from('profiles')
					.select('*')
					.eq('username', username)
					.eq('is_public', true)
					.single()

				if (profileError) {
					if (profileError.code === 'PGRST116') {
						// No rows found
						setNotFound(true)
					}
					throw profileError
				}

				// Fetch public goals
				const { data: goalsData, error: goalsError } = await supabase
					.from('goals')
					.select('*')
					.eq('user_id', profileData.id)
					.eq('is_public', true)

				if (goalsError) throw goalsError

				// Fetch entries for public goals
				if (goalsData.length > 0) {
					const goalIds = goalsData.map((goal) => goal.id)
					const { data: entriesData, error: entriesError } = await supabase
						.from('entries')
						.select('*')
						.in('goal_id', goalIds)

					if (entriesError) throw entriesError
					
					setEntries(entriesData || [])
				}

				setProfile(profileData)
				setGoals(goalsData || [])
			} catch (error) {
				console.error('Error fetching profile:', error)
				// No need to show error toast for not found
				if (!notFound) {
					console.error('Error:', error)
				}
			} finally {
				setIsLoading(false)
			}
		}

		fetchProfileAndGoals()
	}, [username])

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-slate-50">
				<div className="text-center">
					<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em]"></div>
					<p className="text-secondary-600">Loading profile...</p>
				</div>
			</div>
		)
	}

	if (notFound || !profile) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
				<div className="card max-w-md p-6 text-center">
					<h1 className="mb-4 text-2xl font-bold">Profile Not Found</h1>
					<p className="mb-6 text-secondary-600">
						This profile doesn't exist or isn't public.
					</p>
					<Link to="/" className="btn btn-primary inline-flex">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Go Home
					</Link>
				</div>
			</div>
		)
	}

	// Get goal entries
	const getEntriesForGoal = (goalId: string) => {
		return entries.filter((entry) => entry.goal_id === goalId)
	}

	return (
		<div className="min-h-screen bg-slate-50 p-4 md:p-8">
			<div className="mx-auto max-w-4xl">
				<div className="mb-8">
					<Link
						to="/"
						className="flex items-center gap-2 text-secondary-600 hover:text-secondary-900"
					>
						<ArrowLeft className="h-4 w-4" />
						<span>Back to Homepage</span>
					</Link>
				</div>

				<div className="card mb-8">
					<div className="p-6">
						<div className="flex items-center">
							{profile.avatar_url ? (
								<img
									src={profile.avatar_url}
									alt={profile.username}
									className="mr-4 h-20 w-20 rounded-full object-cover"
								/>
							) : (
								<div className="mr-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-primary-600">
									<User className="h-10 w-10" />
								</div>
							)}
							<div>
								<h1 className="text-2xl font-bold">{profile.username}</h1>
								<p className="text-secondary-500">
									Member since {new Date(profile.created_at).toLocaleDateString()}
								</p>
								<p className="mt-2 text-sm">
									{goals.length} public goal{goals.length !== 1 ? 's' : ''}
								</p>
							</div>
						</div>
					</div>
				</div>

				<h2 className="mb-4 text-xl font-semibold">Public Goals</h2>
				
				{goals.length > 0 ? (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
						{goals.map((goal) => {
							const goalEntries = getEntriesForGoal(goal.id)
							const { current, status } = calculateProgress(goalEntries, goal)
							
							return (
								<Link
									key={goal.id}
									to={`/g/${goal.id}`}
									className="card hover:bg-slate-50"
								>
									<div className="p-5">
										<div className="mb-3 flex items-center">
											{goal.avatar_url ? (
												<img
													src={goal.avatar_url}
													alt={goal.name}
													className="mr-3 h-10 w-10 rounded-full object-cover"
												/>
											) : (
												<div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
													<span className="text-lg font-semibold">
														{goal.name.charAt(0)}
													</span>
												</div>
											)}
											<div>
												<h3 className="font-medium text-secondary-900">
													{goal.name}
												</h3>
												<p className="text-sm text-secondary-500">
													{goal.verb}{' '}
													{formatAmount(goal.amount, goal.unit_type, goal.unit)}{' '}
													{goal.orientation} {goal.period}
												</p>
											</div>
										</div>
										
										<div>
											<div className="mb-1 flex items-center justify-between text-sm">
												<span className="font-medium">
													{formatAmount(current, goal.unit_type, goal.unit)}
												</span>
												<span
													className={`rounded-full px-2 py-0.5 text-xs font-medium ${
														status === 'success'
															? 'bg-success-100 text-success-800'
															: status === 'warning'
															? 'bg-warning-100 text-warning-800'
															: status === 'danger'
															? 'bg-error-100 text-error-800'
															: 'bg-secondary-100 text-secondary-800'
													}`}
												>
													{status === 'success'
														? 'On Track'
														: status === 'warning'
														? 'Almost There'
														: status === 'danger'
														? 'Falling Behind'
														: 'In Progress'}
												</span>
											</div>
										</div>
									</div>
								</Link>
							)
						})}
					</div>
				) : (
					<div className="card p-6 text-center">
						<p className="text-secondary-500">
							This user hasn't shared any public goals yet.
						</p>
					</div>
				)}
			</div>
		</div>
	)
}