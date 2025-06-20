/* "use client"

import React from 'react'

import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'

import { useApp } from '@/components/AppProvider'

import { updateUserMetadata } from './action'

const triggers = ["preferences"]

const Settings = () => {
    const { user } = useApp()
    const [darkMode] = [user?.user_metadata.dark_mode]

  return (
    <div
        className='h-screen w-screen flex justify-center items-center'
    >
        <Tabs defaultValue='preferences'>
            <TabsList>
                {triggers.map((trigger, triggerIndex) => (
                    <TabsTrigger key={`trigger-${triggerIndex}`} value={trigger}>{trigger[0].toUpperCase() + trigger.slice(1, trigger.length)}</TabsTrigger>
                ))}
            </TabsList>

            <TabsContent value='preferences'>
                <Card>
                    
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  )
}

export default Settings */