import { clsx, type ClassValue } from 'clsx'
import {
	addDays,
	addMonths,
	addWeeks,
	addYears,
	endOfDay,
	endOfMonth,
	endOfWeek,
	endOfYear,
	format,
	formatDistanceToNow,
	isAfter,
	isBefore,
	startOfDay,
	startOfMonth,
	startOfWeek,
	startOfYear,
	subDays,
	subMonths,
	subWeeks,
	subYears,
} from 'date-fns'
import { twMerge } from 'tailwind-merge'
import { type Database } from './database.types'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export type GoalType = Database['public']['Tables']['goals']['Row']
export type EntryType = Database['public']['Tables']['entries']['Row']
export type ProfileType = Database['public']['Tables']['profiles']['Row']

export type EntryWithGoal = EntryType & {
	goal: GoalType
}

export type Period = 'daily' | 'weekly' | 'monthly' | 'yearly'
export type PeriodInterval = {
	start: Date
	end: Date
}

export function getCurrentPeriod(period: Period): PeriodInterval {
	const now = new Date()
	switch (period) {
		case 'daily':
			return {
				start: startOfDay(now),
				end: endOfDay(now),
			}
		case 'weekly':
			return {
				start: startOfWeek(now, { weekStartsOn: 1 }),
				end: endOfWeek(now, { weekStartsOn: 1 }),
			}
		case 'monthly':
			return {
				start: startOfMonth(now),
				end: endOfMonth(now),
			}
		case 'yearly':
			return {
				start: startOfYear(now),
				end: endOfYear(now),
			}
	}
}

export function getPreviousPeriod(period: Period): PeriodInterval {
	const now = new Date()
	switch (period) {
		case 'daily':
			return {
				start: startOfDay(subDays(now, 1)),
				end: endOfDay(subDays(now, 1)),
			}
		case 'weekly':
			return {
				start: startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
				end: endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
			}
		case 'monthly':
			return {
				start: startOfMonth(subMonths(now, 1)),
				end: endOfMonth(subMonths(now, 1)),
			}
		case 'yearly':
			return {
				start: startOfYear(subYears(now, 1)),
				end: endOfYear(subYears(now, 1)),
			}
	}
}

export function getNextPeriod(period: Period): PeriodInterval {
	const now = new Date()
	switch (period) {
		case 'daily':
			return {
				start: startOfDay(addDays(now, 1)),
				end: endOfDay(addDays(now, 1)),
			}
		case 'weekly':
			return {
				start: startOfWeek(addWeeks(now, 1), { weekStartsOn: 1 }),
				end: endOfWeek(addWeeks(now, 1), { weekStartsOn: 1 }),
			}
		case 'monthly':
			return {
				start: startOfMonth(addMonths(now, 1)),
				end: endOfMonth(addMonths(now, 1)),
			}
		case 'yearly':
			return {
				start: startOfYear(addYears(now, 1)),
				end: endOfYear(addYears(now, 1)),
			}
	}
}

export function isInPeriod(date: Date, period: PeriodInterval): boolean {
	return (
		(isAfter(date, period.start) || date.getTime() === period.start.getTime()) &&
		(isBefore(date, period.end) || date.getTime() === period.end.getTime())
	)
}

export function formatTimestamp(timestamp: string): string {
	return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
}

export function formatAmount(
	amount: number,
	unitType: 'count' | 'number' | 'decimal' | 'duration',
	unit?: string | null
): string {
	if (unitType === 'duration') {
		// Convert seconds to hours and minutes
		const hours = Math.floor(amount / 3600)
		const minutes = Math.floor((amount % 3600) / 60)
		if (hours > 0) {
			return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`
		}
		return `${minutes}m`
	}

	if (unitType === 'decimal') {
		return `${amount.toFixed(2)}${unit ? ` ${unit}` : ''}`
	}

	return `${amount}${unit ? ` ${unit}` : ''}`
}

export function formatPeriod(period: Period): string {
	return period === 'daily'
		? 'Today'
		: period === 'weekly'
		? 'This week'
		: period === 'monthly'
		? 'This month'
		: 'This year'
}

export function formatPeriodWithDate(period: Period): string {
	const now = new Date()
	switch (period) {
		case 'daily':
			return format(now, 'EEEE, MMMM do')
		case 'weekly':
			return `Week of ${format(startOfWeek(now, { weekStartsOn: 1 }), 'MMM d')}`
		case 'monthly':
			return format(now, 'MMMM yyyy')
		case 'yearly':
			return format(now, 'yyyy')
	}
}

export function calculateProgress(
	entries: EntryType[],
	goal: GoalType
): { current: number; status: 'success' | 'warning' | 'danger' | 'neutral' } {
	const currentPeriod = getCurrentPeriod(goal.period)
	
	// Sum all entries for the current period
	const current = entries
		.filter((entry) => isInPeriod(new Date(entry.created_at), currentPeriod))
		.reduce((sum, entry) => sum + entry.amount, 0)
	
	// Determine status based on orientation and progress
	let status: 'success' | 'warning' | 'danger' | 'neutral' = 'neutral'
	
	if (goal.orientation === 'or more') {
		if (current >= goal.amount) {
			status = 'success'
		} else if (current >= goal.amount * 0.7) {
			status = 'warning'
		} else {
			status = 'danger'
		}
	} else if (goal.orientation === 'or less') {
		if (current <= goal.amount) {
			status = 'success'
		} else if (current <= goal.amount * 1.3) {
			status = 'warning'
		} else {
			status = 'danger'
		}
	} else if (goal.orientation === 'exactly') {
		if (current === goal.amount) {
			status = 'success'
		} else if (
			current >= goal.amount * 0.8 &&
			current <= goal.amount * 1.2
		) {
			status = 'warning'
		} else {
			status = 'danger'
		}
	}
	
	return { current, status }
}

export function getProgressPercentage(
	current: number,
	goal: GoalType
): number {
	if (goal.orientation === 'or more') {
		return Math.min((current / goal.amount) * 100, 100)
	} else if (goal.orientation === 'or less') {
		return Math.min(100 - (current / goal.amount) * 100, 100)
	} else {
		// Exactly
		return 100 - Math.min(Math.abs(current - goal.amount) / goal.amount * 100, 100)
	}
}

export function getProgressColor(status: 'success' | 'warning' | 'danger' | 'neutral'): string {
	switch (status) {
		case 'success':
			return 'bg-success-500'
		case 'warning':
			return 'bg-warning-500'
		case 'danger':
			return 'bg-error-500'
		default:
			return 'bg-primary-500'
	}
}

export function getRelativeTimeString(
	date: Date,
	lang = navigator.language
): string {
	const timeMs = date.getTime()
	const deltaSeconds = Math.round((timeMs - Date.now()) / 1000)
	const cutoffs = [
		60,
		3600,
		86400,
		86400 * 7,
		86400 * 30,
		86400 * 365,
		Infinity,
	]
	const units: Intl.RelativeTimeFormatUnit[] = [
		'second',
		'minute',
		'hour',
		'day',
		'week',
		'month',
		'year',
	]
	const unitIndex = cutoffs.findIndex(
		(cutoff) => cutoff > Math.abs(deltaSeconds)
	)
	const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1
	
	const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' })
	return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex])
}