import { Doughnut, Line } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { GoalType, EntryType, calculateProgress } from '../lib/utils'
import { format, subDays } from 'date-fns'

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
)

export function Dashboard() {
	const { user } = useAuth()
	const [goals, setGoals] = useState<GoalType[]>([])
	const [entries, setEntries] = useState<EntryType[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [stats, setStats] = useState({
		totalGoals: 0,
		achievedGoals: 0,
		totalEntries: 0,
		streaks: 0,
	})

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

				if (goalsError) throw goalsError

				// Fetch entries
				const { data: entriesData, error: entriesError } = await supabase
					.from('entries')
					.select('*')
					.eq('user_id', user.id)
					.order('created_at', { ascending: false })

				if (entriesError) throw entriesError

				setGoals(goalsData || [])
				setEntries(entriesData || [])

				// Calculate stats
				const totalGoals = goalsData.length
				const achievedGoals = goalsData.filter((goal) => {
					const { status } = calculateProgress(
						entriesData.filter((entry) => entry.goal_id === goal.id),
						goal
					)
					return status === 'success'
				}).length

				setStats({
					totalGoals,
					achievedGoals,
					totalEntries: entriesData.length,
					streaks: calculateStreaks(entriesData),
				})
			} catch (error) {
				console.error('Error fetching data:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchData()
	}, [user])

	// Calculate current streak
	function calculateStreaks(entries: EntryType[]): number {
		if (entries.length === 0) return 0

		// Sort entries by date
		const sortedEntries = [...entries].sort((a, b) =>
			new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
		)
		
		// Check if there is any entry today
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		
		const latestEntryDate = new Date(sortedEntries[0].created_at)
		latestEntryDate.setHours(0, 0, 0, 0)
		
		// If no entry today, streak is 0
		if (latestEntryDate.getTime() !== today.getTime()) {
			return 0
		}
		
		// Count consecutive days with entries
		let streak = 1
		let currentDate = today
		
		for (let i = 1; i < 100; i++) {
			const previousDate = new Date(currentDate)
			previousDate.setDate(previousDate.getDate() - 1)
			
			const entriesOnDate = sortedEntries.filter((entry) => {
				const entryDate = new Date(entry.created_at)
				entryDate.setHours(0, 0, 0, 0)
				return entryDate.getTime() === previousDate.getTime()
			})
			
			if (entriesOnDate.length === 0) {
				break
			}
			
			streak++
			currentDate = previousDate
		}
		
		return streak
	}

	// Prepare chart data
	const prepareChartData = () => {
		const statusCounts = {
			success: 0,
			warning: 0,
			danger: 0,
			neutral: 0,
		}

		goals.forEach((goal) => {
			const { status } = calculateProgress(
				entries.filter((entry) => entry.goal_id === goal.id),
				goal
			)
			statusCounts[status]++
		})

		return {
			labels: ['On Track', 'Almost There', 'Falling Behind', 'Not Started'],
			datasets: [
				{
					data: [
						statusCounts.success,
						statusCounts.warning,
						statusCounts.danger,
						statusCounts.neutral,
					],
					backgroundColor: [
						'rgba(34, 197, 94, 0.8)',
						'rgba(245, 158, 11, 0.8)',
						'rgba(239, 68, 68, 0.8)',
						'rgba(148, 163, 184, 0.8)',
					],
					borderColor: [
						'rgba(34, 197, 94, 1)',
						'rgba(245, 158, 11, 1)',
						'rgba(239, 68, 68, 1)',
						'rgba(148, 163, 184, 1)',
					],
					borderWidth: 1,
				},
			],
		}
	}

	// Prepare activity chart data
	const prepareActivityData = () => {
		const days = 7
		const labels = Array.from({ length: days }).map((_, i) => {
			const date = subDays(new Date(), days - 1 - i)
			return format(date, 'EEE')
		})

		const data = Array.from({ length: days }).map((_, i) => {
			const date = subDays(new Date(), days - 1 - i)
			date.setHours(0, 0, 0, 0)
			
			return entries.filter((entry) => {
				const entryDate = new Date(entry.created_at)
				entryDate.setHours(0, 0, 0, 0)
				return entryDate.getTime() === date.getTime()
			}).length
		})

		return {
			labels,
			datasets: [
				{
					label: 'Entries',
					data,
					borderColor: 'rgba(14, 165, 233, 1)',
					backgroundColor: 'rgba(14, 165, 233, 0.1)',
					tension: 0.4,
					fill: true,
				},
			],
		}
	}

	// Get goals by period
	const getGoalsByPeriod = () => {
		const daily = goals.filter((goal) => goal.period === 'daily').length
		const weekly = goals.filter((goal) => goal.period === 'weekly').length
		const monthly = goals.filter((goal) => goal.period === 'monthly').length
		const yearly = goals.filter((goal) => goal.period === 'yearly').length
		
		return { daily, weekly, monthly, yearly }
	}

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<div className="text-center">
					<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em]"></div>
					<p className="text-secondary-600">Loading dashboard...</p>
				</div>
			</div>
		)
	}

	const periodStats = getGoalsByPeriod()

	return (
		<div>
			<h1 className="mb-6 text-2xl font-bold sm:text-3xl">Dashboard</h1>

			{/* Stats cards */}
			<div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div className="card p-5">
					<h2 className="text-secondary-500">Total Goals</h2>
					<p className="mt-2 text-3xl font-bold">{stats.totalGoals}</p>
				</div>
				<div className="card p-5">
					<h2 className="text-secondary-500">Achieved Goals</h2>
					<p className="mt-2 text-3xl font-bold">
						{stats.achievedGoals}/{stats.totalGoals}
					</p>
				</div>
				<div className="card p-5">
					<h2 className="text-secondary-500">Total Entries</h2>
					<p className="mt-2 text-3xl font-bold">{stats.totalEntries}</p>
				</div>
				<div className="card p-5">
					<h2 className="text-secondary-500">Current Streak</h2>
					<p className="mt-2 text-3xl font-bold">{stats.streaks} days</p>
				</div>
			</div>

			{/* Charts */}
			<div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
				<div className="card p-5">
					<h2 className="mb-4 text-xl font-semibold">Goal Status</h2>
					<div className="flex justify-center p-4">
						{goals.length > 0 ? (
							<div className="h-64 w-64">
								<Doughnut
									data={prepareChartData()}
									options={{
										plugins: {
											legend: {
												position: 'bottom',
											},
										},
										maintainAspectRatio: false,
									}}
								/>
							</div>
						) : (
							<p className="text-center text-secondary-500">No goals to display</p>
						)}
					</div>
				</div>
				
				<div className="card p-5">
					<h2 className="mb-4 text-xl font-semibold">Activity (Last 7 Days)</h2>
					<div className="p-4">
						{entries.length > 0 ? (
							<div className="h-64">
								<Line
									data={prepareActivityData()}
									options={{
										plugins: {
											legend: {
												display: false,
											},
										},
										scales: {
											y: {
												beginAtZero: true,
												ticks: {
													precision: 0,
												},
											},
										},
										maintainAspectRatio: false,
									}}
								/>
							</div>
						) : (
							<p className="text-center text-secondary-500">
								No activity to display
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Period breakdown */}
			<div className="card p-5">
				<h2 className="mb-4 text-xl font-semibold">Goal Periods</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
					<div className="rounded-lg bg-blue-50 p-4 text-center">
						<h3 className="text-lg font-medium">Daily</h3>
						<p className="mt-2 text-2xl font-bold">{periodStats.daily}</p>
					</div>
					<div className="rounded-lg bg-green-50 p-4 text-center">
						<h3 className="text-lg font-medium">Weekly</h3>
						<p className="mt-2 text-2xl font-bold">{periodStats.weekly}</p>
					</div>
					<div className="rounded-lg bg-purple-50 p-4 text-center">
						<h3 className="text-lg font-medium">Monthly</h3>
						<p className="mt-2 text-2xl font-bold">{periodStats.monthly}</p>
					</div>
					<div className="rounded-lg bg-orange-50 p-4 text-center">
						<h3 className="text-lg font-medium">Yearly</h3>
						<p className="mt-2 text-2xl font-bold">{periodStats.yearly}</p>
					</div>
				</div>
			</div>
		</div>
	)
}