import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { 
  GoalType, 
  EntryType, 
  formatAmount, 
  calculateProgress 
} from '../lib/utils'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { format, subDays, eachDayOfInterval } from 'date-fns'
import { Trophy, TrendingUp, Calendar, CheckSquare } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export function Stats() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<GoalType[]>([])
  const [entries, setEntries] = useState<EntryType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  useEffect(() => {
    if (!user) return

    async function fetchData() {
      setIsLoading(true)
      try {
        const { data: goalsData, error: goalsError } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id)

        if (goalsError) throw goalsError

        const { data: entriesData, error: entriesError } = await supabase
          .from('entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (entriesError) throw entriesError

        setGoals(goalsData || [])
        setEntries(entriesData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Calculate top goals by entries
  const getTopGoalsByEntries = () => {
    if (!goals || !entries) return []

    const goalCounts = goals.map(goal => {
      const goalEntries = entries.filter(entry => entry.goal_id === goal.id)
      return {
        goal,
        count: goalEntries.length,
        total: goalEntries.reduce((sum, entry) => sum + entry.amount, 0)
      }
    })

    return goalCounts
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  // Get activity data based on selected period
  const getActivityData = () => {
    if (!entries || entries.length === 0) return null

    let days = 7
    if (selectedPeriod === 'month') days = 30
    else if (selectedPeriod === 'year') days = 365

    // Create date range
    const dateRange = eachDayOfInterval({
      start: subDays(new Date(), days - 1),
      end: new Date()
    })

    // Format labels based on period
    const labels = dateRange.map(date => {
      if (selectedPeriod === 'week') return format(date, 'EEE')
      if (selectedPeriod === 'month') return format(date, 'MMM d')
      return format(date, 'MMM')
    })

    // Count entries per day
    const data = dateRange.map(date => {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)
      
      return entries.filter(entry => {
        const entryDate = new Date(entry.created_at)
        return entryDate >= startOfDay && entryDate <= endOfDay
      }).length
    })

    return {
      labels,
      datasets: [
        {
          label: 'Activity',
          data,
          backgroundColor: 'rgba(14, 165, 233, 0.8)',
          borderRadius: 4,
        }
      ]
    }
  }

  // Calculate completion rates
  const getCompletionRates = () => {
    if (!goals || !entries) return { success: 0, total: 0, rate: 0 }

    const successfulGoals = goals.filter(goal => {
      const { status } = calculateProgress(
        entries.filter(entry => entry.goal_id === goal.id),
        goal
      )
      return status === 'success'
    }).length

    return {
      success: successfulGoals,
      total: goals.length,
      rate: goals.length > 0 ? (successfulGoals / goals.length) * 100 : 0
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em]"></div>
          <p className="text-secondary-600">Loading statistics...</p>
        </div>
      </div>
    )
  }

  const topGoals = getTopGoalsByEntries()
  const activityData = getActivityData()
  const completionRates = getCompletionRates()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Statistics</h1>

      {/* Key Metrics */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-primary-100 p-3 text-primary-500">
              <CheckSquare className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-secondary-500">Completion Rate</h3>
              <p className="text-2xl font-bold">
                {completionRates.rate.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-5">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-success-100 p-3 text-success-500">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-secondary-500">Goals Achieved</h3>
              <p className="text-2xl font-bold">
                {completionRates.success}/{completionRates.total}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-5">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-warning-100 p-3 text-warning-500">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-secondary-500">Total Activities</h3>
              <p className="text-2xl font-bold">
                {entries.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-5">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-secondary-100 p-3 text-secondary-500">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-secondary-500">Active Days</h3>
              <p className="text-2xl font-bold">
                {new Set(entries.map(entry => 
                  new Date(entry.created_at).toDateString()
                )).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="mb-8 card p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Activity Overview</h2>
          
          <div className="flex rounded-lg border border-secondary-200">
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`px-4 py-2 text-sm font-medium ${
                selectedPeriod === 'week'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-secondary-700 hover:bg-secondary-50'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-4 py-2 text-sm font-medium ${
                selectedPeriod === 'month'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-secondary-700 hover:bg-secondary-50'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setSelectedPeriod('year')}
              className={`px-4 py-2 text-sm font-medium ${
                selectedPeriod === 'year'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-secondary-700 hover:bg-secondary-50'
              }`}
            >
              Year
            </button>
          </div>
        </div>
        
        {activityData ? (
          <div className="h-80">
            <Bar
              data={activityData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      title: function(tooltipItems) {
                        return `${tooltipItems[0].label} - Entries: ${tooltipItems[0].raw}`
                      },
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0
                    }
                  }
                }
              }}
            />
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <p className="text-secondary-500">No activity data available</p>
          </div>
        )}
      </div>

      {/* Top Goals */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold">Top Goals</h2>
        </div>
        
        {topGoals.length > 0 ? (
          <div className="divide-y divide-secondary-200">
            {topGoals.map(({ goal, count, total }) => (
              <div key={goal.id} className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  {goal.avatar_url ? (
                    <img
                      src={goal.avatar_url}
                      alt={goal.name}
                      className="mr-3 h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                      <span className="text-lg font-semibold">{goal.name.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-secondary-900">{goal.name}</h3>
                    <p className="text-sm text-secondary-500">
                      {count} entries · Total: {formatAmount(total, goal.unit_type, goal.unit)}
                    </p>
                  </div>
                </div>
                
                <div className="rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
                  {goal.period}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center">
            <p className="text-secondary-500">No goals data available</p>
          </div>
        )}
      </div>
    </div>
  )
}