import { Loader2 } from 'lucide-react'
interface LoadingScreenProps {
    size?: number
    props?: any
}

export const SpinningLoader = ({ size, ...props } : {
	size?: number
	props?: any
}) => {
	 return (
		 <Loader2 size={size || 28} className='animate-spin' {...props} />
	 )
}
const LoadingScreen = ({size, ...props} : LoadingScreenProps) => {
    return (
        <div className='w-screen h-screen flex justify-center items-center'>
            <SpinningLoader size={size} {...props} />
        </div>
    )
}

export default LoadingScreen