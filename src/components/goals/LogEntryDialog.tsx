import { useState } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { useToast } from '../ui/toaster'
import { GoalType } from '../../lib/utils'

interface LogEntryDialogProps {
	open: boolean
	setOpen: (open: boolean) => void
	goal: GoalType
	onSuccess: () => void
}

export function LogEntryDialog({
	open,
	setOpen,
	goal,
	onSuccess,
}: LogEntryDialogProps) {
	const { user } = useAuth()
	const { toast } = useToast()
	
	const [amount, setAmount] = useState(goal.unit_type === 'count' ? '1' : '')
	const [note, setNote] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	if (!open) return null

	const handleClose = () => {
		setOpen(false)
		setAmount(goal.unit_type === 'count' ? '1' : '')
		setNote('')
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!user) return

		setIsLoading(true)

		try {
			// Convert amount to number based on type
			let value: number
			
			if (goal.unit_type === 'duration') {
				// Assuming amount is in minutes, convert to seconds
				value = parseFloat(amount) * 60
			} else if (goal.unit_type === 'decimal') {
				value = parseFloat(amount)
			} else {
				value = parseInt(amount, 10)
			}

			const { error } = await supabase.from('entries').insert({
				goal_id: goal.id,
				user_id: user.id,
				amount: value,
				note: note || null,
			})

			if (error) throw error

			toast('Progress logged successfully', 'success')
			onSuccess()
			handleClose()
		} catch (error) {
			console.error('Error logging entry:', error)
			toast('Failed to log progress', 'error')
		} finally {
			setIsLoading(false)
		}
	}

	// Determine input type and placeholder based on goal type
	const getInputProps = () => {
		switch (goal.unit_type) {
			case 'count':
				return {
					type: 'number',
					placeholder: '1',
					step: '1',
					min: '1',
				}
			case 'number':
				return {
					type: 'number',
					placeholder: `Enter amount${goal.unit ? ` in ${goal.unit}` : ''}`,
					step: '1',
					min: '0',
				}
			case 'decimal':
				return {
					type: 'number',
					placeholder: `Enter amount${goal.unit ? ` in ${goal.unit}` : ''}`,
					step: '0.01',
					min: '0',
				}
			case 'duration':
				return {
					type: 'number',
					placeholder: 'Enter minutes',
					step: '1',
					min: '1',
				}
			default:
				return {
					type: 'number',
					placeholder: 'Enter amount',
					step: '1',
					min: '0',
				}
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-950/50 p-4">
			<div className="w-full max-w-md rounded-lg bg-white shadow-xl">
				<div className="flex items-center justify-between border-b p-4">
					<h2 className="text-xl font-semibold">Log Progress</h2>
					<button
						onClick={handleClose}
						className="rounded-full p-1 text-secondary-500 hover:bg-secondary-100"
					>
						<X className="h-5 w-5" />
					</button>
				</div>
				
				<form onSubmit={handleSubmit} className="p-4">
					<div className="mb-2 rounded-lg bg-secondary-50 p-3">
						<h3 className="font-medium text-secondary-900">{goal.name}</h3>
						<p className="text-sm text-secondary-600">
							{goal.verb} {goal.amount} {goal.orientation} {goal.period}
						</p>
					</div>
					
					<div className="space-y-4">
						<div>
							<label htmlFor="amount" className="label">
								{goal.unit_type === 'count'
									? 'Count'
									: goal.unit_type === 'duration'
									? 'Duration'
									: 'Amount'}
							</label>
							<div className="flex items-center">
								<input
									id="amount"
									{...getInputProps()}
									className="input"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									required
								/>
								{goal.unit_type === 'duration' && (
									<span className="ml-2 text-secondary-700">minutes</span>
								)}
								{goal.unit && goal.unit_type !== 'duration' && (
									<span className="ml-2 text-secondary-700">{goal.unit}</span>
								)}
							</div>
							{goal.unit_type === 'duration' && (
								<p className="mt-1 text-xs text-secondary-500">
									Enter time in minutes
								</p>
							)}
						</div>
						
						<div>
							<label htmlFor="note" className="label">
								Note (optional)
							</label>
							<textarea
								id="note"
								className="input"
								placeholder="Add a note about this entry"
								rows={2}
								value={note}
								onChange={(e) => setNote(e.target.value)}
							></textarea>
						</div>
						
						<div className="flex justify-end gap-2">
							<button
								type="button"
								onClick={handleClose}
								className="btn btn-outline"
								disabled={isLoading}
							>
								Cancel
							</button>
							<button
								type="submit"
								className="btn btn-primary"
								disabled={isLoading}
							>
								{isLoading ? 'Saving...' : 'Save Entry'}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}