import { cn } from "@/lib/utils"
import React from "react"

interface ProgressCircleProps {
    currentProgress: number
    maximumProgress: number
    circleSize?: number
    className?: string
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
    currentProgress,
    maximumProgress,
    circleSize = 2,
    className,
}) => {
    return (
        <div className={cn("flex w-fit h-fit p-2 space-x-2 rounded-xl bg-gray-100", className)}>
            {Array(maximumProgress).fill(0).map((_, index) => (
                <div className={`${currentProgress >= index ? "bg-black" : "bg-gray-300"} opacity-75 rounded-full w-${circleSize} h-${circleSize}`} key={index}></div>
            ))}
        </div>
    )
}

export default ProgressCircle