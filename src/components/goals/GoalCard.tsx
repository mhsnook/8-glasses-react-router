import { MoreHorizontal, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
	formatAmount,
	calculateProgress,
	getProgressPercentage,
	getProgressColor,
	type GoalType,
	type EntryType,
} from '../../lib/utils'
import { GoalProgress } from './GoalProgress'
import { LogEntryDialog } from './LogEntryDialog'
import { useState } from 'react'

interface GoalCardProps {
	goal: GoalType
	entries: EntryType[]
	onEntryAdded: () => void
}

export function GoalCard({ goal, entries, onEntryAdded }: GoalCardProps) {
	const [logEntryOpen, setLogEntryOpen] = useState(false)
	
	const { current, status } = calculateProgress(entries, goal)
	const progressPercent = getProgressPercentage(current, goal)
	const progressColor = getProgressColor(status)

	return (
		<div className="card overflow-visible">
			<div className="p-5">
				<div className="mb-3 flex items-center justify-between">
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
								{goal.verb} {formatAmount(goal.amount, goal.unit_type, goal.unit)}{' '}
								{goal.orientation} {goal.period}
							</p>
						</div>
					</div>
					<div className="flex">
						<Link
							to={`/goals/${goal.id}`}
							className="text-secondary-500 hover:text-secondary-700"
						>
							<MoreHorizontal className="h-5 w-5" />
						</Link>
					</div>
				</div>

				<GoalProgress
					current={current}
					goal={goal}
					progressPercent={progressPercent}
					progressColor={progressColor}
				/>
				
				<div className="mt-4 flex justify-between">
					<button
						onClick={() => setLogEntryOpen(true)}
						className="btn btn-primary flex-1"
					>
						<Plus className="h-4 w-4" />
						<span>Log Progress</span>
					</button>
				</div>
			</div>

			<LogEntryDialog
				open={logEntryOpen}
				setOpen={setLogEntryOpen}
				goal={goal}
				onSuccess={onEntryAdded}
			/>
		</div>
	)
}