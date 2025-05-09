import { useEffect, useState } from 'react'
import { GoalCard } from '../components/goals/GoalCard'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import {
	GoalType,
	EntryType,
	getCurrentPeriod,
	isInPeriod,
	formatPeriodWithDate,
} from '../lib/utils'
import { Plus } from 'lucide-react'
import { CreateGoalDialog } from '../components/goals/CreateGoalDialog'

export function Home() {
	const { user } = useAuth()
	const [goals, setGoals] = useState<GoalType[]>([])
	const [entries, setEntries] = useState<EntryType[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [createGoalOpen, setCreateGoalOpen] = useState(false)

	useEffect(() => {
		if (!user) return

		// Fetch user's goals and entries
		async function fetchData() {
			setIsLoading(true)
			try {
				// Fetch goals
				const { data: goalsData, error: goalsError } = await supabase
					.from('goals')
					.select('*')
					.eq('user_id', user.id)
					.order('created_at', { ascending: false })

				if (goalsError) throw goalsError

				// Fetch entries for all goals
				const goalIds = goalsData.map((goal) => goal.id)
				
				if (goalIds.length > 0) {
					const { data: entriesData, error: entriesError } = await supabase
						.from('entries')
						.select('*')
						.in('goal_id', goalIds)
						.order('created_at', { ascending: false })

					if (entriesError) throw entriesError
					
					setGoals(goalsData)
					setEntries(entriesData || [])
				} else {
					setGoals([])
					setEntries([])
				}
			} catch (error) {
				console.error('Error fetching data:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchData()
	}, [user])

	const handleEntryAdded = async () => {
		if (!user || !goals.length) return

		try {
			// Refresh entries
			const goalIds = goals.map((goal) => goal.id)
			const { data, error } = await supabase
				.from('entries')
				.select('*')
				.in('goal_id', goalIds)
				.order('created_at', { ascending: false })

			if (error) throw error
			setEntries(data || [])
		} catch (error) {
			console.error('Error refreshing entries:', error)
		}
	}

	// Filter entries by goal
	const getEntriesForGoal = (goalId: string) => {
		return entries.filter((entry) => entry.goal_id === goalId)
	}

	const getProgressSummary = () => {
		// Get entries for the current period (daily, weekly, monthly)
		const dailyGoals = goals.filter((goal) => goal.period === 'daily')
		const weeklyGoals = goals.filter((goal) => goal.period === 'weekly')
		const monthlyGoals = goals.filter((goal) => goal.period === 'monthly')
		
		// Count goals that are on track (achieved or on the way)
		const dailyPeriod = getCurrentPeriod('daily')
		const weeklyPeriod = getCurrentPeriod('weekly')
		const monthlyPeriod = getCurrentPeriod('monthly')

		const dailyOnTrack = dailyGoals.filter((goal) => {
			const goalEntries = entries.filter(
				(entry) =>
					entry.goal_id === goal.id &&
					isInPeriod(new Date(entry.created_at), dailyPeriod)
			)
			const total = goalEntries.reduce((sum, entry) => sum + entry.amount, 0)
			
			if (goal.orientation === 'or more') {
				return total >= goal.amount
			} else if (goal.orientation === 'or less') {
				return total <= goal.amount
			} else {
				return total === goal.amount
			}
		}).length

		const weeklyOnTrack = weeklyGoals.filter((goal) => {
			const goalEntries = entries.filter(
				(entry) =>
					entry.goal_id === goal.id &&
					isInPeriod(new Date(entry.created_at), weeklyPeriod)
			)
			const total = goalEntries.reduce((sum, entry) => sum + entry.amount, 0)
			
			if (goal.orientation === 'or more') {
				return total >= goal.amount
			} else if (goal.orientation === 'or less') {
				return total <= goal.amount
			} else {
				return total === goal.amount
			}
		}).length

		const monthlyOnTrack = monthlyGoals.filter((goal) => {
			const goalEntries = entries.filter(
				(entry) =>
					entry.goal_id === goal.id &&
					isInPeriod(new Date(entry.created_at), monthlyPeriod)
			)
			const total = goalEntries.reduce((sum, entry) => sum + entry.amount, 0)
			
			if (goal.orientation === 'or more') {
				return total >= goal.amount
			} else if (goal.orientation === 'or less') {
				return total <= goal.amount
			} else {
				return total === goal.amount
			}
		}).length

		return {
			daily: {
				total: dailyGoals.length,
				onTrack: dailyOnTrack,
			},
			weekly: {
				total: weeklyGoals.length,
				onTrack: weeklyOnTrack,
			},
			monthly: {
				total: monthlyGoals.length,
				onTrack: monthlyOnTrack,
			},
		}
	}

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<div className="text-center">
					<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em]"></div>
					<p className="text-secondary-600">Loading your goals...</p>
				</div>
			</div>
		)
	}

	const summary = getProgressSummary()
	const currentDate = formatPeriodWithDate('daily')

	return (
		<div>
			<div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h1 className="text-2xl font-bold sm:text-3xl">My Goals</h1>
					<p className="text-secondary-600">{currentDate}</p>
				</div>
				<button
					onClick={() => setCreateGoalOpen(true)}
					className="btn btn-primary"
				>
					<Plus className="h-4 w-4" />
					<span>Add New Goal</span>
				</button>
			</div>

			{/* Summary cards */}
			<div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div className="rounded-lg bg-green-50 p-4">
					<h3 className="font-medium">Daily Progress</h3>
					<p className="mt-2 text-2xl font-bold">
						{summary.daily.onTrack}/{summary.daily.total}
					</p>
					<p className="text-secondary-600">goals on track</p>
				</div>
				<div className="rounded-lg bg-blue-50 p-4">
					<h3 className="font-medium">Weekly Progress</h3>
					<p className="mt-2 text-2xl font-bold">
						{summary.weekly.onTrack}/{summary.weekly.total}
					</p>
					<p className="text-secondary-600">goals on track</p>
				</div>
				<div className="rounded-lg bg-purple-50 p-4">
					<h3 className="font-medium">Monthly Progress</h3>
					<p className="mt-2 text-2xl font-bold">
						{summary.monthly.onTrack}/{summary.monthly.total}
					</p>
					<p className="text-secondary-600">goals on track</p>
				</div>
			</div>

			{goals.length === 0 ? (
				<div className="rounded-lg border border-dashed border-secondary-300 bg-secondary-50 p-10 text-center">
					<h3 className="mb-2 text-lg font-medium">No goals yet</h3>
					<p className="mb-4 text-secondary-600">
						Get started by creating your first goal
					</p>
					<button
						onClick={() => setCreateGoalOpen(true)}
						className="btn btn-primary inline-flex"
					>
						<Plus className="h-4 w-4" />
						<span>Create Goal</span>
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 md:grid-auto-fit" style={{ '--min': '20rem' } as any}>
					{goals.map((goal) => (
						<GoalCard
							key={goal.id}
							goal={goal}
							entries={getEntriesForGoal(goal.id)}
							onEntryAdded={handleEntryAdded}
						/>
					))}
				</div>
			)}

			<CreateGoalDialog
				open={createGoalOpen}
				setOpen={setCreateGoalOpen}
			/>
		</div>
	)
}