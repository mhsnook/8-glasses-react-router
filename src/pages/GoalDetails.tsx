import {
	Share2,
	Edit,
	ArrowLeft,
	Trash,
	Check,
	X,
	Globe,
	Lock,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EntryList } from '../components/goals/EntryList'
import { LogEntryDialog } from '../components/goals/LogEntryDialog'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import {
	EntryType,
	GoalType,
	calculateProgress,
	formatAmount,
	formatPeriodWithDate,
	getProgressColor,
	getProgressPercentage,
} from '../lib/utils'
import { useToast } from '../components/ui/toaster'

export function GoalDetails() {
	const { goalId } = useParams<{ goalId: string }>()
	const { user } = useAuth()
	const { toast } = useToast()
	const navigate = useNavigate()
	
	const [goal, setGoal] = useState<GoalType | null>(null)
	const [entries, setEntries] = useState<EntryType[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [logEntryOpen, setLogEntryOpen] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [shareUrl, setShareUrl] = useState('')
	const [isEditing, setIsEditing] = useState(false)
	const [editedGoal, setEditedGoal] = useState<Partial<GoalType>>({})

	useEffect(() => {
		if (!user || !goalId) return

		async function fetchGoalAndEntries() {
			setIsLoading(true)
			try {
				// Fetch goal
				const { data: goalData, error: goalError } = await supabase
					.from('goals')
					.select('*')
					.eq('id', goalId)
					.eq('user_id', user.id)
					.single()

				if (goalError) {
					if (goalError.code === 'PGRST116') {
						// No rows found
						navigate('/')
						return
					}
					throw goalError
				}

				// Fetch entries
				const { data: entriesData, error: entriesError } = await supabase
					.from('entries')
					.select('*')
					.eq('goal_id', goalId)
					.order('created_at', { ascending: false })

				if (entriesError) throw entriesError

				setGoal(goalData)
				setEntries(entriesData || [])
				setEditedGoal(goalData)
				setShareUrl(`${window.location.origin}/g/${goalId}`)
			} catch (error) {
				console.error('Error fetching goal details:', error)
				toast('Failed to load goal details', 'error')
			} finally {
				setIsLoading(false)
			}
		}

		fetchGoalAndEntries()
	}, [user, goalId, navigate])

	const handleEntryUpdated = async () => {
		if (!goalId) return

		try {
			const { data, error } = await supabase
				.from('entries')
				.select('*')
				.eq('goal_id', goalId)
				.order('created_at', { ascending: false })

			if (error) throw error
			setEntries(data || [])
		} catch (error) {
			console.error('Error refreshing entries:', error)
		}
	}

	const handleDelete = async () => {
		if (!user || !goal) return

		if (!window.confirm('Are you sure you want to delete this goal? All entries will be permanently deleted.')) {
			return
		}

		setIsDeleting(true)

		try {
			// Delete entries first
			const { error: entriesError } = await supabase
				.from('entries')
				.delete()
				.eq('goal_id', goal.id)

			if (entriesError) throw entriesError

			// Then delete the goal
			const { error: goalError } = await supabase
				.from('goals')
				.delete()
				.eq('id', goal.id)
				.eq('user_id', user.id)

			if (goalError) throw goalError

			toast('Goal deleted successfully', 'success')
			navigate('/')
		} catch (error) {
			console.error('Error deleting goal:', error)
			toast('Failed to delete goal', 'error')
			setIsDeleting(false)
		}
	}

	const handleShare = async () => {
		if (!goal) return

		if (!goal.is_public) {
			if (window.confirm('This goal is currently private. Make it public to share?')) {
				try {
					const { error } = await supabase
						.from('goals')
						.update({ is_public: true })
						.eq('id', goal.id)
						.eq('user_id', user.id)

					if (error) throw error

					setGoal({ ...goal, is_public: true })
					toast('Goal is now public and can be shared', 'success')
				} catch (error) {
					console.error('Error updating goal:', error)
					toast('Failed to make goal public', 'error')
					return
				}
			} else {
				return
			}
		}

		// Share functionality
		if (navigator.share) {
			try {
				await navigator.share({
					title: `My ${goal.name} goal`,
					text: `Check out my progress on ${goal.verb} ${goal.amount} ${goal.name} ${goal.orientation} ${goal.period}`,
					url: shareUrl,
				})
			} catch (error) {
				console.error('Error sharing:', error)
				copyToClipboard()
			}
		} else {
			copyToClipboard()
		}
	}

	const copyToClipboard = () => {
		navigator.clipboard.writeText(shareUrl)
		toast('Permalink copied to clipboard', 'success')
	}

	const togglePublic = async () => {
		if (!goal || !user) return

		try {
			const newStatus = !goal.is_public
			const { error } = await supabase
				.from('goals')
				.update({ is_public: newStatus })
				.eq('id', goal.id)
				.eq('user_id', user.id)

			if (error) throw error

			setGoal({ ...goal, is_public: newStatus })
			toast(
				newStatus
					? 'Goal is now public and can be shared'
					: 'Goal is now private',
				'success'
			)
		} catch (error) {
			console.error('Error updating goal:', error)
			toast('Failed to update goal visibility', 'error')
		}
	}

	const handleEdit = async () => {
		if (isEditing) {
			// Save changes
			try {
				const { error } = await supabase
					.from('goals')
					.update(editedGoal)
					.eq('id', goal?.id)
					.eq('user_id', user?.id)

				if (error) throw error

				setGoal({ ...goal!, ...editedGoal })
				toast('Goal updated successfully', 'success')
				setIsEditing(false)
			} catch (error) {
				console.error('Error updating goal:', error)
				toast('Failed to update goal', 'error')
			}
		} else {
			// Enter edit mode
			setIsEditing(true)
		}
	}

	const cancelEdit = () => {
		setIsEditing(false)
		setEditedGoal(goal || {})
	}

	if (isLoading || !goal) {
		return (
			<div className="flex h-64 items-center justify-center">
				<div className="text-center">
					<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em]"></div>
					<p className="text-secondary-600">Loading goal details...</p>
				</div>
			</div>
		)
	}

	const { current, status } = calculateProgress(entries, goal)
	const progressPercent = getProgressPercentage(current, goal)
	const progressColor = getProgressColor(status)

	return (
		<div>
			<div className="mb-6">
				<Link
					to="/"
					className="mb-4 inline-flex items-center text-secondary-600 hover:text-secondary-900"
				>
					<ArrowLeft className="mr-1 h-4 w-4" />
					<span>Back to Goals</span>
				</Link>

				<div className="flex flex-wrap items-start justify-between gap-4">
					<div className="flex-1">
						{isEditing ? (
							<input
								type="text"
								className="input mb-2 text-2xl font-bold"
								value={editedGoal.name || ''}
								onChange={(e) =>
									setEditedGoal({ ...editedGoal, name: e.target.value })
								}
							/>
						) : (
							<h1 className="mb-2 text-2xl font-bold sm:text-3xl">{goal.name}</h1>
						)}
						
						{isEditing ? (
							<div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
								<div>
									<label className="label">Verb</label>
									<input
										type="text"
										className="input"
										value={editedGoal.verb || ''}
										onChange={(e) =>
											setEditedGoal({ ...editedGoal, verb: e.target.value })
										}
									/>
								</div>
								<div>
									<label className="label">Amount</label>
									<input
										type={goal.unit_type === 'decimal' ? 'number' : 'text'}
										step={goal.unit_type === 'decimal' ? '0.01' : '1'}
										className="input"
										value={editedGoal.amount || ''}
										onChange={(e) =>
											setEditedGoal({
												...editedGoal,
												amount: parseFloat(e.target.value),
											})
										}
									/>
								</div>
								<div>
									<label className="label">Orientation</label>
									<select
										className="input"
										value={editedGoal.orientation || ''}
										onChange={(e) =>
											setEditedGoal({
												...editedGoal,
												orientation: e.target.value as any,
											})
										}
									>
										<option value="or more">or more</option>
										<option value="or less">or less</option>
										<option value="exactly">exactly</option>
									</select>
								</div>
								<div>
									<label className="label">Period</label>
									<select
										className="input"
										value={editedGoal.period || ''}
										onChange={(e) =>
											setEditedGoal({
												...editedGoal,
												period: e.target.value as any,
											})
										}
									>
										<option value="daily">daily</option>
										<option value="weekly">weekly</option>
										<option value="monthly">monthly</option>
										<option value="yearly">yearly</option>
									</select>
								</div>
								<div>
									<label className="label">Unit (optional)</label>
									<input
										type="text"
										className="input"
										value={editedGoal.unit || ''}
										onChange={(e) =>
											setEditedGoal({ ...editedGoal, unit: e.target.value })
										}
									/>
								</div>
								<div>
									<label className="label">Description</label>
									<input
										type="text"
										className="input"
										value={editedGoal.description || ''}
										onChange={(e) =>
											setEditedGoal({
												...editedGoal,
												description: e.target.value,
											})
										}
									/>
								</div>
							</div>
						) : (
							<div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2">
								<p className="text-lg text-secondary-700">
									{goal.verb} {formatAmount(goal.amount, goal.unit_type, goal.unit)}{' '}
									{goal.orientation} {goal.period}
								</p>
								<div className="flex items-center gap-1 text-sm">
									{goal.is_public ? (
										<>
											<Globe className="h-4 w-4 text-primary-500" />
											<span>Public</span>
										</>
									) : (
										<>
											<Lock className="h-4 w-4 text-secondary-500" />
											<span>Private</span>
										</>
									)}
								</div>
							</div>
						)}
					</div>

					<div className="flex flex-wrap gap-2">
						{isEditing ? (
							<>
								<button onClick={cancelEdit} className="btn btn-outline">
									<X className="h-4 w-4" />
									<span>Cancel</span>
								</button>
								<button onClick={handleEdit} className="btn btn-primary">
									<Check className="h-4 w-4" />
									<span>Save</span>
								</button>
							</>
						) : (
							<>
								<button
									onClick={() => setLogEntryOpen(true)}
									className="btn btn-primary"
								>
									<Plus className="h-4 w-4" />
									<span>Log Progress</span>
								</button>
								<button onClick={handleEdit} className="btn btn-outline">
									<Edit className="h-4 w-4" />
									<span>Edit</span>
								</button>
								<button onClick={togglePublic} className="btn btn-outline">
									{goal.is_public ? (
										<>
											<Lock className="h-4 w-4" />
											<span>Make Private</span>
										</>
									) : (
										<>
											<Globe className="h-4 w-4" />
											<span>Make Public</span>
										</>
									)}
								</button>
								<button onClick={handleShare} className="btn btn-outline">
									<Share2 className="h-4 w-4" />
									<span>Share</span>
								</button>
								<button
									onClick={handleDelete}
									className="btn btn-outline text-error-600 hover:bg-error-50 hover:text-error-700"
									disabled={isDeleting}
								>
									{isDeleting ? (
										<span className="block h-4 w-4 animate-spin rounded-full border-2 border-error-400 border-t-transparent"></span>
									) : (
										<Trash className="h-4 w-4" />
									)}
									<span>Delete</span>
								</button>
							</>
						)}
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div className="col-span-1 lg:col-span-2">
					<div className="card">
						<div className="card-header flex items-center justify-between">
							<h2 className="text-xl font-semibold">Goal Progress</h2>
							<span className="text-sm text-secondary-500">
								{formatPeriodWithDate(goal.period)}
							</span>
						</div>
						
						<div className="card-body">
							<div className="mb-6">
								<div className="mb-3 flex items-center justify-between">
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
							
							<EntryList
								entries={entries}
								goal={goal}
								onEntryUpdated={handleEntryUpdated}
							/>
						</div>
					</div>
				</div>
				
				<div>
					<div className="card">
						<div className="card-header">
							<h2 className="text-xl font-semibold">Details</h2>
						</div>
						
						<div className="card-body">
							<dl className="space-y-4 text-sm">
								<div>
									<dt className="text-secondary-500">Created</dt>
									<dd>{new Date(goal.created_at).toLocaleDateString()}</dd>
								</div>
								{goal.description && (
									<div>
										<dt className="text-secondary-500">Description</dt>
										<dd>{goal.description}</dd>
									</div>
								)}
								<div>
									<dt className="text-secondary-500">Type</dt>
									<dd className="capitalize">{goal.unit_type}</dd>
								</div>
								{goal.unit && (
									<div>
										<dt className="text-secondary-500">Unit</dt>
										<dd>{goal.unit}</dd>
									</div>
								)}
								<div>
									<dt className="text-secondary-500">Total Entries</dt>
									<dd>{entries.length}</dd>
								</div>
								<div>
									<dt className="text-secondary-500">Total Logged</dt>
									<dd>
										{formatAmount(
											entries.reduce((sum, entry) => sum + entry.amount, 0),
											goal.unit_type,
											goal.unit
										)}
									</dd>
								</div>
							</dl>
						</div>
					</div>
				</div>
			</div>

			<LogEntryDialog
				open={logEntryOpen}
				setOpen={setLogEntryOpen}
				goal={goal}
				onSuccess={handleEntryUpdated}
			/>
		</div>
	)
}