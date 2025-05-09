import { formatAmount, type GoalType } from '../../lib/utils'

interface GoalProgressProps {
	current: number
	goal: GoalType
	progressPercent: number
	progressColor: string
}

export function GoalProgress({
	current,
	goal,
	progressPercent,
	progressColor,
}: GoalProgressProps) {
	return (
		<div>
			<div className="mb-1 flex items-center justify-between text-sm">
				<span className="font-medium">
					{formatAmount(current, goal.unit_type, goal.unit)}
				</span>
				<span className="text-secondary-500">
					{goal.orientation === 'or more'
						? `Target: ${formatAmount(goal.amount, goal.unit_type, goal.unit)}+`
						: goal.orientation === 'or less'
						? `Limit: ${formatAmount(goal.amount, goal.unit_type, goal.unit)}`
						: `Goal: ${formatAmount(goal.amount, goal.unit_type, goal.unit)}`}
				</span>
			</div>
			<div className="h-2 w-full overflow-hidden rounded-full bg-secondary-100">
				<div
					className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
					style={{ width: `${progressPercent}%` }}
				></div>
			</div>
		</div>
	)
}