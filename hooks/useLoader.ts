import React, { useState } from 'react'

import LoadingScreen from '@/components/ui/loading-screen'

const useLoader = (init?: boolean) => {
    const [loading, setLoading] = useState<boolean>(init || false)

    return { loading, setLoading, LoadingScreen }
}

export default useLoader