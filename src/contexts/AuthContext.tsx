import { Session, User } from '@supabase/supabase-js'
import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ProfileType } from '../lib/utils'

interface AuthContextType {
	user: User | null
	profile: ProfileType | null
	session: Session | null
	isLoading: boolean
	signIn: (email: string, password: string) => Promise<{
		error: Error | null
	}>
	signUp: (
		email: string,
		password: string,
		username: string
	) => Promise<{
		error: Error | null
	}>
	signOut: () => Promise<void>
	updateProfile: (updates: Partial<ProfileType>) => Promise<{
		error: Error | null
	}>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [profile, setProfile] = useState<ProfileType | null>(null)
	const [session, setSession] = useState<Session | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const navigate = useNavigate()

	// Get initial session and set up listener
	useEffect(() => {
		setIsLoading(true)
		
		// Get current session
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session)
			setUser(session?.user ?? null)
			
			if (session?.user) {
				fetchProfile(session.user.id)
			} else {
				setIsLoading(false)
			}
		})

		// Set up auth listener
		const { data: { subscription } } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setSession(session)
				setUser(session?.user ?? null)
				
				if (session?.user) {
					fetchProfile(session.user.id)
				} else {
					setProfile(null)
					setIsLoading(false)
				}
			}
		)

		return () => {
			subscription.unsubscribe()
		}
	}, [])

	// Fetch user profile
	async function fetchProfile(userId: string) {
		setIsLoading(true)
		
		const { data, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', userId)
			.single()
		
		if (error) {
			console.error('Error fetching profile:', error)
			setIsLoading(false)
			return
		}
		
		setProfile(data)
		setIsLoading(false)
	}

	// Sign in with email and password
	async function signIn(email: string, password: string) {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		})
		
		if (!error) {
			navigate('/')
		}
		
		return { error }
	}

	// Sign up with email and password
	async function signUp(email: string, password: string, username: string) {
		const { error: signUpError, data } = await supabase.auth.signUp({
			email,
			password,
		})
		
		if (signUpError) {
			return { error: signUpError }
		}
		
		if (data.user) {
			const { error: profileError } = await supabase.from('profiles').insert({
				id: data.user.id,
				username,
				is_public: false,
			})
			
			if (profileError) {
				return { error: profileError }
			}
			
			navigate('/')
		}
		
		return { error: null }
	}

	// Sign out
	async function signOut() {
		await supabase.auth.signOut()
		navigate('/login')
	}

	// Update profile
	async function updateProfile(updates: Partial<ProfileType>) {
		if (!user) {
			return { error: new Error('User not authenticated') }
		}
		
		const { error } = await supabase
			.from('profiles')
			.update(updates)
			.eq('id', user.id)
		
		if (!error && profile) {
			setProfile({ ...profile, ...updates })
		}
		
		return { error }
	}

	const value = {
		user,
		profile,
		session,
		isLoading,
		signIn,
		signUp,
		signOut,
		updateProfile,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const context = useContext(AuthContext)
	
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	
	return context
}