export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[]

export interface Database {
	public: {
		Tables: {
			goals: {
				Row: {
					id: string
					created_at: string
					user_id: string
					name: string
					verb: string
					amount: number
					orientation: 'or more' | 'or less' | 'exactly'
					period: 'daily' | 'weekly' | 'monthly' | 'yearly'
					unit_type: 'count' | 'number' | 'decimal' | 'duration'
					avatar_url: string | null
					description: string | null
					is_public: boolean
					unit: string | null
				}
				Insert: {
					id?: string
					created_at?: string
					user_id: string
					name: string
					verb: string
					amount: number
					orientation: 'or more' | 'or less' | 'exactly'
					period: 'daily' | 'weekly' | 'monthly' | 'yearly'
					unit_type: 'count' | 'number' | 'decimal' | 'duration'
					avatar_url?: string | null
					description?: string | null
					is_public?: boolean
					unit?: string | null
				}
				Update: {
					id?: string
					created_at?: string
					user_id?: string
					name?: string
					verb?: string
					amount?: number
					orientation?: 'or more' | 'or less' | 'exactly'
					period?: 'daily' | 'weekly' | 'monthly' | 'yearly'
					unit_type?: 'count' | 'number' | 'decimal' | 'duration'
					avatar_url?: string | null
					description?: string | null
					is_public?: boolean
					unit?: string | null
				}
				Relationships: [
					{
						foreignKeyName: 'goals_user_id_fkey'
						columns: ['user_id']
						referencedRelation: 'profiles'
						referencedColumns: ['id']
					}
				]
			}
			entries: {
				Row: {
					id: string
					created_at: string
					goal_id: string
					user_id: string
					amount: number
					note: string | null
				}
				Insert: {
					id?: string
					created_at?: string
					goal_id: string
					user_id: string
					amount: number
					note?: string | null
				}
				Update: {
					id?: string
					created_at?: string
					goal_id?: string
					user_id?: string
					amount?: number
					note?: string | null
				}
				Relationships: [
					{
						foreignKeyName: 'entries_goal_id_fkey'
						columns: ['goal_id']
						referencedRelation: 'goals'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'entries_user_id_fkey'
						columns: ['user_id']
						referencedRelation: 'profiles'
						referencedColumns: ['id']
					}
				]
			}
			profiles: {
				Row: {
					id: string
					created_at: string
					username: string
					avatar_url: string | null
					is_public: boolean
				}
				Insert: {
					id: string
					created_at?: string
					username: string
					avatar_url?: string | null
					is_public?: boolean
				}
				Update: {
					id?: string
					created_at?: string
					username?: string
					avatar_url?: string | null
					is_public?: boolean
				}
				Relationships: [
					{
						foreignKeyName: 'profiles_id_fkey'
						columns: ['id']
						referencedRelation: 'users'
						referencedColumns: ['id']
					}
				]
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			[_ in never]: never
		}
		Enums: {
			[_ in never]: never
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
}