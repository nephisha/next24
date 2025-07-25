export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    }

    return (
        <div className="flex justify-center items-center p-8">
            <div className={`animate-spin rounded-full border-b-2 border-primary-600 ${sizeClasses[size]}`} />
        </div>
    )
}