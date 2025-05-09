import {
	createContext,
	useContext,
	useState,
	type ReactNode,
	useEffect,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, X, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '../../lib/utils'

type ToastType = 'success' | 'error' | 'warning' | 'info'
type Toast = {
	id: string
	message: string
	type: ToastType
}

interface ToastContextType {
	toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([])

	const toast = (message: string, type: ToastType = 'info') => {
		const id = Math.random().toString(36).substring(2, 9)
		setToasts((prev) => [...prev, { id, message, type }])

		// Auto remove after 5 seconds
		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id))
		}, 5000)
	}

	return (
		<ToastContext.Provider value={{ toast }}>
			{children}
			<Toaster toasts={toasts} setToasts={setToasts} />
		</ToastContext.Provider>
	)
}

export function useToast() {
	const context = useContext(ToastContext)
	if (context === undefined) {
		throw new Error('useToast must be used within a ToastProvider')
	}
	return context
}

function getToastIcon(type: ToastType) {
	switch (type) {
		case 'success':
			return <CheckCircle className="h-5 w-5 text-success-500" />
		case 'error':
			return <AlertCircle className="h-5 w-5 text-error-500" />
		case 'warning':
			return <AlertTriangle className="h-5 w-5 text-warning-500" />
		case 'info':
			return <Info className="h-5 w-5 text-primary-500" />
	}
}

function getToastClasses(type: ToastType) {
	switch (type) {
		case 'success':
			return 'border-l-success-500 bg-success-50'
		case 'error':
			return 'border-l-error-500 bg-error-50'
		case 'warning':
			return 'border-l-warning-500 bg-warning-50'
		case 'info':
			return 'border-l-primary-500 bg-primary-50'
	}
}

function Toaster({
	toasts,
	setToasts,
}: {
	toasts: Toast[]
	setToasts: React.Dispatch<React.SetStateAction<Toast[]>>
}) {
	return (
		<div className="fixed bottom-0 right-0 z-50 flex w-full flex-col items-end gap-2 p-4 sm:max-w-sm">
			<AnimatePresence>
				{toasts?.map((toast) => (
					<motion.div
						key={toast.id}
						initial={{ opacity: 0, y: 50, scale: 0.8 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						className={cn(
							'w-full border-l-4 rounded-lg shadow-lg p-4 flex items-center gap-3',
							getToastClasses(toast.type)
						)}
					>
						{getToastIcon(toast.type)}
						<p className="flex-1 text-secondary-800">{toast.message}</p>
						<button
							onClick={() =>
								setToasts((prev) => prev.filter((t) => t.id !== toast.id))
							}
							className="text-secondary-400 hover:text-secondary-600"
						>
							<X className="h-5 w-5" />
						</button>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	)
}

export { Toaster }