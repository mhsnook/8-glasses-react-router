import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { GoalType, ProfileType } from '../lib/utils'
import { Edit, Save, User, Globe, Lock } from 'lucide-react'
import { useToast } from '../components/ui/toaster'

export function Profile() {
	const { user, profile, updateProfile } = useAuth()
	const { toast } = useToast()
	
	const [goals, setGoals] = useState<GoalType[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isEditing, setIsEditing] = useState(false)
	const [formData, setFormData] = useState<Partial<ProfileType>>({
		username: '',
		avatar_url: '',
		is_public: false,
	})

	useEffect(() => {
		if (!user) return

		// Initialize form data from profile
		if (profile) {
			setFormData({
				username: profile.username,
				avatar_url: profile.avatar_url || '',
				is_public: profile.is_public,
			})
		}

		// Fetch user's goals
		async function fetchGoals() {
			setIsLoading(true)
			try {
				const { data, error } = await supabase
					.from('goals')
					.select('*')
					.eq('user_id', user.id)

				if (error) throw error
				setGoals(data || [])
			} catch (error) {
				console.error('Error fetching goals:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchGoals()
	}, [user, profile])

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setFormData({
			...formData,
			[name]: value,
		})
	}

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target
		setFormData({
			...formData,
			[name]: checked,
		})
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			const { error } = await updateProfile(formData)
			if (error) throw error
			
			setIsEditing(false)
			toast('Profile updated successfully', 'success')
		} catch (error) {
			console.error('Error updating profile:', error)
			toast('Failed to update profile', 'error')
		}
	}

	if (!profile) {
		return (
			<div className="flex h-64 items-center justify-center">
				<div className="text-center">
					<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em]"></div>
					<p className="text-secondary-600">Loading profile...</p>
				</div>
			</div>
		)
	}

	const shareUrl = `${window.location.origin}/u/${profile.username}`

	return (
		<div className="space-y-8">
			<h1 className="text-2xl font-bold sm:text-3xl">Your Profile</h1>

			<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
				<div className="col-span-1 md:col-span-2">
					<div className="card">
						<div className="card-header flex items-center justify-between">
							<h2 className="text-xl font-semibold">Profile Information</h2>
							<button
								onClick={() => setIsEditing(!isEditing)}
								className="btn btn-sm btn-outline"
							>
								{isEditing ? (
									<>
										<Save className="h-4 w-4" />
										<span>Save</span>
									</>
								) : (
									<>
										<Edit className="h-4 w-4" />
										<span>Edit</span>
									</>
								)}
							</button>
						</div>
						
						<div className="card-body">
							{isEditing ? (
								<form onSubmit={handleSubmit}>
									<div className="space-y-4">
										<div>
											<label htmlFor="username" className="label">
												Username
											</label>
											<input
												id="username"
												name="username"
												type="text"
												className="input"
												value={formData.username}
												onChange={handleInputChange}
												required
											/>
										</div>
										
										<div>
											<label htmlFor="avatar_url" className="label">
												Avatar URL
											</label>
											<input
												id="avatar_url"
												name="avatar_url"
												type="url"
												className="input"
												placeholder="https://example.com/avatar.jpg"
												value={formData.avatar_url || ''}
												onChange={handleInputChange}
											/>
											<p className="mt-1 text-xs text-secondary-500">
												Enter a URL for your profile picture
											</p>
										</div>
										
										<div className="flex items-center">
											<input
												id="is_public"
												name="is_public"
												type="checkbox"
												className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
												checked={formData.is_public}
												onChange={handleCheckboxChange}
											/>
											<label
												htmlFor="is_public"
												className="ml-2 text-sm text-secondary-700"
											>
												Make my profile public
												<span className="ml-1 text-xs text-secondary-500">
													(Others can see your public goals)
												</span>
											</label>
										</div>
										
										<div className="flex justify-end pt-2">
											<button
												type="button"
												onClick={() => setIsEditing(false)}
												className="btn btn-outline mr-2"
											>
												Cancel
											</button>
											<button type="submit" className="btn btn-primary">
												Save Changes
											</button>
										</div>
									</div>
								</form>
							) : (
								<div className="space-y-4">
									<div className="flex items-center">
										{profile.avatar_url ? (
											<img
												src={profile.avatar_url}
												alt={profile.username}
												className="mr-4 h-20 w-20 rounded-full object-cover"
											/>
										) : (
											<div className="mr-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-primary-600">
												<User className="h-10 w-10" />
											</div>
										)}
										
										<div>
											<h3 className="text-xl font-bold">{profile.username}</h3>
											<p className="text-secondary-500">{user?.email}</p>
											<div className="mt-2 flex items-center text-sm">
												{profile.is_public ? (
													<>
														<Globe className="mr-1 h-4 w-4 text-primary-500" />
														<span>Public profile</span>
													</>
												) : (
													<>
														<Lock className="mr-1 h-4 w-4 text-secondary-500" />
														<span>Private profile</span>
													</>
												)}
											</div>
										</div>
									</div>
									
									{profile.is_public && (
										<div className="rounded-lg bg-primary-50 p-4">
											<p className="mb-2 text-sm text-secondary-700">
												Your profile is public. Share it with others:
											</p>
											<div className="flex">
												<input
													type="text"
													readOnly
													value={shareUrl}
													className="input flex-1 rounded-r-none bg-white text-sm"
												/>
												<button
													onClick={() => {
														navigator.clipboard.writeText(shareUrl)
														toast('Profile link copied to clipboard', 'success')
													}}
													className="btn btn-primary rounded-l-none"
												>
													Copy
												</button>
											</div>
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="col-span-1">
					<div className="card">
						<div className="card-header">
							<h2 className="text-xl font-semibold">Account Statistics</h2>
						</div>
						
						<div className="card-body">
							<div className="space-y-4">
								<div>
									<h3 className="text-sm font-medium text-secondary-500">
										Member Since
									</h3>
									<p className="text-lg">
										{new Date(profile.created_at).toLocaleDateString()}
									</p>
								</div>
								
								<div>
									<h3 className="text-sm font-medium text-secondary-500">
										Total Goals
									</h3>
									<p className="text-lg">{goals.length}</p>
								</div>
								
								<div>
									<h3 className="text-sm font-medium text-secondary-500">
										Public Goals
									</h3>
									<p className="text-lg">
										{goals.filter((goal) => goal.is_public).length}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="card">
				<div className="card-header">
					<h2 className="text-xl font-semibold">Privacy Settings</h2>
				</div>
				
				<div className="card-body">
					<div className="space-y-4">
						<p className="text-secondary-700">
							These settings control who can see your profile and goals.
						</p>
						
						<div className="rounded-lg border border-secondary-200 p-4">
							<div className="flex items-start">
								<div className="mr-3 mt-0.5">
									{profile.is_public ? (
										<Globe className="h-5 w-5 text-primary-500" />
									) : (
										<Lock className="h-5 w-5 text-secondary-500" />
									)}
								</div>
								<div>
									<h3 className="font-medium">Profile Visibility</h3>
									<p className="mb-3 text-sm text-secondary-600">
										{profile.is_public
											? 'Your profile is public. Anyone with the link can see your public goals.'
											: 'Your profile is private. Only you can see your goals.'}
									</p>
									<button
										onClick={async () => {
											try {
												await updateProfile({
													is_public: !profile.is_public,
												})
												setFormData({
													...formData,
													is_public: !profile.is_public,
												})
												toast(
													profile.is_public
														? 'Your profile is now private'
														: 'Your profile is now public',
													'success'
												)
											} catch (error) {
												console.error('Error updating profile:', error)
												toast('Failed to update privacy settings', 'error')
											}
										}}
										className="btn btn-sm btn-outline"
									>
										{profile.is_public ? 'Make Private' : 'Make Public'}
									</button>
								</div>
							</div>
						</div>
						
						<div className="rounded-lg border border-secondary-200 p-4">
							<div className="flex items-start">
								<div className="mr-3 mt-0.5">
									<Lock className="h-5 w-5 text-secondary-500" />
								</div>
								<div>
									<h3 className="font-medium">Goal Privacy</h3>
									<p className="mb-3 text-sm text-secondary-600">
										By default, new goals are private. You can change individual goal
										privacy settings from each goal's page.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}