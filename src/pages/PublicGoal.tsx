import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
	EntryType,
	GoalType,
	ProfileType,
	calculateProgress,
	formatAmount,
	formatPeriodWithDate,
	getProgressColor,
	getProgressPercentage,
} from '../lib/utils'
import { ArrowLeft, User } from 'lucide-react'

export function PublicGoal() {
	const { goalId } = useParams<{ goalId: string }>()
	
	const [goal, setGoal] = useState<GoalType | null>(null)
	const [entries, setEntries] = useState<EntryType[]>([])
	const [profile, setProfile] = useState<ProfileType | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [notFound, setNotFound] = useState(false)

	useEffect(() => {
		if (!goalId) return

		async function fetchGoalAndEntries() {
			setIsLoading(true)
			try {
				// Fetch goal (only if public)
				const { data: goalData, error: goalError } = await supabase
					.from('goals')
					.select('*')
					.eq('id', goalId)
					.eq('is_public', true)
					.single()

				if (goalError) {
					if (goalError.code === 'PGRST116') {
						// No rows found
						setNotFound(true)
					}
					throw goalError
				}

				// Fetch user profile
				const { data: profileData, error: profileError } = await supabase
					.from('profiles')
					.select('*')
					.eq('id', goalData.user_id)
					.single()

				if (profileError) throw profileError

				// Fetch entries
				const { data: entriesData, error: entriesError } = await supabase
					.from('entries')
					.select('*')
					.eq('goal_id', goalId)
					.order('created_at', { ascending: false })

				if (entriesError) throw entriesError

				setGoal(goalData)
				setProfile(profileData)
				setEntries(entriesData || [])
			} catch (error) {
				console.error('Error fetching goal details:', error)
				// No need to show error toast for not found
				if (!notFound) {
					console.error('Error:', error)
				}
			} finally {
				setIsLoading(false)
			}
		}

		fetchGoalAndEntries()
	}, [goalId])

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-slate-50">
				<div className="text-center">
					<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em]"></div>
					<p className="text-secondary-600">Loading goal details...</p>
				</div>
			</div>
		)
	}

	if (notFound || !goal || !profile) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
				<div className="card max-w-md p-6 text-center">
					<h1 className="mb-4 text-2xl font-bold">Goal Not Found</h1>
					<p className="mb-6 text-secondary-600">
						This goal doesn't exist or isn't public.
					</p>
					<Link to="/" className="btn btn-primary inline-flex">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Go Home
					</Link>
				</div>
			</div>
		)
	}

	const { current, status } = calculateProgress(entries, goal)
	const progressPercent = getProgressPercentage(current, goal)
	const progressColor = getProgressColor(status)

	return (
		<div className="min-h-screen bg-slate-50 p-4 md:p-8">
			<div className="mx-auto max-w-4xl">
				<div className="mb-8 flex items-center justify-between">
					<Link
						to="/"
						className="flex items-center gap-2 text-secondary-600 hover:text-secondary-900"
					>
						<ArrowLeft className="h-4 w-4" />
						<span>Back to Homepage</span>
					</Link>
					
					<Link
						to={`/u/${profile.username}`}
						className="flex items-center gap-2 rounded-full bg-white p-2 px-4 shadow-sm hover:bg-secondary-50"
					>
						{profile.avatar_url ? (
							<img
								src={profile.avatar_url}
								alt={profile.username}
								className="h-6 w-6 rounded-full object-cover"
							/>
						) : (
							<User className="h-5 w-5 text-secondary-400" />
						)}
						<span className="font-medium">{profile.username}</span>
					</Link>
				</div>

				<div className="card mb-6">
					<div className="p-6">
						<div className="mb-4 flex items-center">
							{goal.avatar_url ? (
								<img
									src={goal.avatar_url}
									alt={goal.name}
									className="mr-4 h-16 w-16 rounded-full object-cover"
								/>
							) : (
								<div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600">
									<span className="text-2xl font-semibold">{goal.name.charAt(0)}</span>
								</div>
							)}
							<div>
								<h1 className="text-2xl font-bold">{goal.name}</h1>
								<p className="text-lg text-secondary-700">
									{goal.verb} {formatAmount(goal.amount, goal.unit_type, goal.unit)}{' '}
									{goal.orientation} {goal.period}
								</p>
							</div>
						</div>

						{goal.description && (
							<p className="mb-4 rounded-lg bg-secondary-50 p-4 text-secondary-700">
								{goal.description}
							</p>
						)}

						<div className="mb-6">
							<div className="mb-2 flex items-center justify-between">
								<div>
									<span className="text-2xl font-bold">
										{formatAmount(current, goal.unit_type, goal.unit)}
									</span>
									<span className="ml-2 text-secondary-500">
										{goal.orientation === 'or more'
											? `of ${formatAmount(goal.amount, goal.unit_type, goal.unit)}+`
											: goal.orientation === 'or less'
											? `of ${formatAmount(goal.amount, goal.unit_type, goal.unit)} limit`
											: `of ${formatAmount(goal.amount, goal.unit_type, goal.unit)} goal`}
									</span>
								</div>
								<div
									className={`rounded-full px-3 py-1 text-sm font-medium ${
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
								</div>
							</div>
							
							<div className="h-4 w-full overflow-hidden rounded-full bg-secondary-100">
								<div
									className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
									style={{ width: `${progressPercent}%` }}
								></div>
							</div>
						</div>

						<div className="text-right">
							<p className="text-sm text-secondary-500">
								{formatPeriodWithDate(goal.period)}
							</p>
						</div>
					</div>
				</div>

				<div className="card">
					<div className="card-header">
						<h2 className="text-xl font-semibold">Recent Activity</h2>
					</div>
					
					{entries.length > 0 ? (
						<div className="divide-y divide-secondary-200">
							{entries.slice(0, 10).map((entry) => (
								<div key={entry.id} className="p-4">
									<div className="flex items-center justify-between">
										<span className="font-medium">
											{formatAmount(entry.amount, goal.unit_type, goal.unit)}
										</span>
										<span className="text-sm text-secondary-500">
											{new Date(entry.created_at).toLocaleDateString()} at{' '}
											{new Date(entry.created_at).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit',
											})}
										</span>
									</div>
									{entry.note && (
										<p className="mt-1 text-sm text-secondary-600">{entry.note}</p>
									)}
								</div>
							))}

							{entries.length > 10 && (
								<div className="p-4 text-center text-secondary-500">
									Showing 10 of {entries.length} entries
								</div>
							)}
						</div>
					) : (
						<div className="p-6 text-center text-secondary-500">
							No activity to show
						</div>
					)}
				</div>
			</div>
		</div>
	)
}