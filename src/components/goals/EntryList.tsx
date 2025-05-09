import { Edit, Trash } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import {
	formatAmount,
	formatTimestamp,
	type EntryType,
	type GoalType,
} from '../../lib/utils'
import { useToast } from '../ui/toaster'
import { EditEntryDialog } from './EditEntryDialog'

interface EntryListProps {
	entries: EntryType[]
	goal: GoalType
	onEntryUpdated: () => void
}

export function EntryList({ entries, goal, onEntryUpdated }: EntryListProps) {
	const { user } = useAuth()
	const { toast } = useToast()
	const [editEntry, setEditEntry] = useState<EntryType | null>(null)
	const [isDeleting, setIsDeleting] = useState<string | null>(null)

	const handleDelete = async (entryId: string) => {
		if (!user) return
		
		if (!window.confirm('Are you sure you want to delete this entry?')) {
			return
		}
		
		setIsDeleting(entryId)
		
		try {
			const { error } = await supabase
				.from('entries')
				.delete()
				.eq('id', entryId)
				.eq('user_id', user.id)
			
			if (error) throw error
			
			toast('Entry deleted successfully', 'success')
			onEntryUpdated()
		} catch (error) {
			console.error('Error deleting entry:', error)
			toast('Failed to delete entry', 'error')
		} finally {
			setIsDeleting(null)
		}
	}

	if (entries.length === 0) {
		return (
			<div className="mt-4 rounded-lg border border-dashed border-secondary-300 bg-secondary-50 p-6 text-center">
				<p className="text-secondary-600">No entries yet</p>
			</div>
		)
	}

	return (
		<div className="mt-4">
			<h3 className="mb-2 font-medium">History</h3>
			<div className="divide-y divide-secondary-200 rounded-lg border border-secondary-200">
				{entries.map((entry) => (
					<div
						key={entry.id}
						className="flex items-center justify-between p-3"
					>
						<div className="flex-1">
							<div className="flex items-center">
								<span className="font-medium text-secondary-900">
									{formatAmount(entry.amount, goal.unit_type, goal.unit)}
								</span>
								<span className="ml-2 text-sm text-secondary-500">
									{formatTimestamp(entry.created_at)}
								</span>
							</div>
							{entry.note && (
								<p className="mt-1 text-sm text-secondary-700">{entry.note}</p>
							)}
						</div>
						
						<div className="flex items-center gap-2">
							<button
								onClick={() => setEditEntry(entry)}
								className="rounded p-1 text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700"
								title="Edit entry"
							>
								<Edit className="h-4 w-4" />
							</button>
							<button
								onClick={() => handleDelete(entry.id)}
								className="rounded p-1 text-secondary-500 hover:bg-error-100 hover:text-error-700"
								title="Delete entry"
								disabled={isDeleting === entry.id}
							>
								{isDeleting === entry.id ? (
									<span className="block h-4 w-4 animate-spin rounded-full border-2 border-secondary-400 border-t-transparent"></span>
								) : (
									<Trash className="h-4 w-4" />
								)}
							</button>
						</div>
					</div>
				))}
			</div>
			
			{editEntry && (
				<EditEntryDialog
					entry={editEntry}
					goal={goal}
					open={!!editEntry}
					setOpen={() => setEditEntry(null)}
					onSuccess={onEntryUpdated}
				/>
			)}
		</div>
	)
}