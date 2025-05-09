import { X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { useToast } from '../ui/toaster'

const ORIENTATION_OPTIONS = [
	{ value: 'or more', label: 'or more' },
	{ value: 'or less', label: 'or less' },
	{ value: 'exactly', label: 'exactly' },
]

const PERIOD_OPTIONS = [
	{ value: 'daily', label: 'daily' },
	{ value: 'weekly', label: 'weekly' },
	{ value: 'monthly', label: 'monthly' },
	{ value: 'yearly', label: 'yearly' },
]

const UNIT_TYPE_OPTIONS = [
	{ value: 'count', label: 'Count (increment by 1)' },
	{ value: 'number', label: 'Number (integer)' },
	{ value: 'decimal', label: 'Decimal' },
	{ value: 'duration', label: 'Duration (time)' },
]

interface CreateGoalDialogProps {
	open: boolean
	setOpen: (open: boolean) => void
}

export function CreateGoalDialog({ open, setOpen }: CreateGoalDialogProps) {
	const { user } = useAuth()
	const { toast } = useToast()
	
	const [verb, setVerb] = useState('')
	const [amount, setAmount] = useState('')
	const [name, setName] = useState('')
	const [orientation, setOrientation] = useState<'or more' | 'or less' | 'exactly'>('or more')
	const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily')
	const [unitType, setUnitType] = useState<'count' | 'number' | 'decimal' | 'duration'>('count')
	const [unit, setUnit] = useState('')
	const [description, setDescription] = useState('')
	const [avatarUrl, setAvatarUrl] = useState('')
	const [isPublic, setIsPublic] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const resetForm = () => {
		setVerb('')
		setAmount('')
		setName('')
		setOrientation('or more')
		setPeriod('daily')
		setUnitType('count')
		setUnit('')
		setDescription('')
		setAvatarUrl('')
		setIsPublic(false)
	}

	const handleClose = () => {
		setOpen(false)
		resetForm()
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!user) return

		setIsLoading(true)

		try {
			// Convert amount to number
			let amountNum: number
			if (unitType === 'duration') {
				// Convert to seconds
				const timeValue = parseFloat(amount)
				const timeUnit = unit.toLowerCase()
				if (timeUnit === 'hours' || timeUnit === 'hour') {
					amountNum = timeValue * 3600 // hours to seconds
				} else {
					amountNum = timeValue * 60 // minutes to seconds
				}
			} else if (unitType === 'decimal') {
				amountNum = parseFloat(amount)
			} else {
				amountNum = parseInt(amount, 10)
			}

			const { error } = await supabase.from('goals').insert({
				user_id: user.id,
				verb,
				amount: amountNum,
				name,
				orientation,
				period,
				unit_type: unitType,
				unit: unit || null,
				description: description || null,
				avatar_url: avatarUrl || null,
				is_public: isPublic,
			})

			if (error) {
				throw error
			}

			toast('Goal created successfully', 'success')
			handleClose()
		} catch (error) {
			console.error('Error creating goal:', error)
			toast('Failed to create goal. Please try again.', 'error')
		} finally {
			setIsLoading(false)
		}
	}

	if (!open) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-950/50 p-4">
			<div className="w-full max-w-md rounded-lg bg-white shadow-xl">
				<div className="flex items-center justify-between border-b p-4">
					<h2 className="text-xl font-semibold">Create New Goal</h2>
					<button
						onClick={handleClose}
						className="rounded-full p-1 text-secondary-500 hover:bg-secondary-100"
					>
						<X className="h-5 w-5" />
					</button>
				</div>
				
				<form onSubmit={handleSubmit} className="p-4">
					<div className="space-y-4">
						{/* First row: Verb and amount */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label htmlFor="verb" className="label">
									Verb
								</label>
								<input
									id="verb"
									type="text"
									className="input"
									placeholder="e.g., drink, run, read"
									value={verb}
									onChange={(e) => setVerb(e.target.value)}
									required
								/>
							</div>
							<div>
								<label htmlFor="amount" className="label">
									Amount
								</label>
								<input
									id="amount"
									type={unitType === 'decimal' ? 'number' : 'text'}
									step={unitType === 'decimal' ? '0.01' : '1'}
									className="input"
									placeholder="e.g., 8, 5.5, 30"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									required
								/>
							</div>
						</div>

						{/* Name */}
						<div>
							<label htmlFor="name" className="label">
								Name
							</label>
							<input
								id="name"
								type="text"
								className="input"
								placeholder="e.g., glasses of water, miles, books"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>

						{/* Orientation */}
						<div>
							<label htmlFor="orientation" className="label">
								Orientation
							</label>
							<select
								id="orientation"
								className="input"
								value={orientation}
								onChange={(e) => setOrientation(e.target.value as any)}
								required
							>
								{ORIENTATION_OPTIONS.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						{/* Period */}
						<div>
							<label htmlFor="period" className="label">
								Period
							</label>
							<select
								id="period"
								className="input"
								value={period}
								onChange={(e) => setPeriod(e.target.value as any)}
								required
							>
								{PERIOD_OPTIONS.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						{/* Unit Type */}
						<div>
							<label htmlFor="unitType" className="label">
								Unit Type
							</label>
							<select
								id="unitType"
								className="input"
								value={unitType}
								onChange={(e) => setUnitType(e.target.value as any)}
								required
							>
								{UNIT_TYPE_OPTIONS.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						{/* Unit (if applicable) */}
						{unitType !== 'count' && (
							<div>
								<label htmlFor="unit" className="label">
									Unit
								</label>
								<input
									id="unit"
									type="text"
									className="input"
									placeholder={
										unitType === 'duration'
											? 'minutes, hours'
											: unitType === 'decimal'
											? 'km, miles, liters'
											: 'pushups, pages'
									}
									value={unit}
									onChange={(e) => setUnit(e.target.value)}
								/>
							</div>
						)}

						{/* Description */}
						<div>
							<label htmlFor="description" className="label">
								Description (optional)
							</label>
							<textarea
								id="description"
								className="input"
								placeholder="Add more details about your goal"
								rows={3}
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							></textarea>
						</div>

						{/* Avatar URL */}
						<div>
							<label htmlFor="avatarUrl" className="label">
								Avatar URL (optional)
							</label>
							<input
								id="avatarUrl"
								type="url"
								className="input"
								placeholder="https://example.com/image.jpg"
								value={avatarUrl}
								onChange={(e) => setAvatarUrl(e.target.value)}
							/>
						</div>

						{/* Public/Private */}
						<div className="flex items-center">
							<input
								id="isPublic"
								type="checkbox"
								className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
								checked={isPublic}
								onChange={(e) => setIsPublic(e.target.checked)}
							/>
							<label htmlFor="isPublic" className="ml-2 text-sm text-secondary-700">
								Make this goal public
							</label>
						</div>

						{/* Preview */}
						<div className="rounded-lg border border-secondary-200 bg-secondary-50 p-3">
							<p className="text-center text-secondary-800">
								I want to{' '}
								<span className="font-medium">{verb || '[verb]'}</span>{' '}
								<span className="font-medium">{amount || '[amount]'}</span>{' '}
								<span className="font-medium">{name || '[name]'}</span>{' '}
								<span className="font-medium">{orientation}</span>{' '}
								<span className="font-medium">{period}</span>
							</p>
						</div>

						{/* Submit and Cancel buttons */}
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
								{isLoading ? 'Creating...' : 'Create Goal'}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}