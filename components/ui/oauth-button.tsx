"use client"

import React, { ReactElement } from 'react'

import { Button } from './button'
const GoogleLogo = ({ className } : { className?: string }) => {return (<svg className='' width="20px" height="20px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><title>google</title><g id="Layer_2" data-name="Layer 2"><g id="invisible_box" data-name="invisible box"><rect width="48" height="48" fill="none"/><rect width="48" height="48" fill="none"/></g><g id="icons_Q2" data-name="icons Q2"><path d="M24.7,20.5v7.6H35.6a10.9,10.9,0,0,1-10.9,8,12.1,12.1,0,1,1,7.9-21.3l5.6-5.6A20,20,0,1,0,24.7,44c16.8,0,20.5-15.7,18.9-23.5Z"/></g></g></svg>)}

// actions
import { signInWithOAuthAction } from '@/app/actions'
import { Provider } from '@supabase/supabase-js'

const OAuthButton = ({provider, redirectRoute, children, logo, logoClassname, ...props} : {
    provider: Provider
    redirectRoute: string
    children?: any
    logo?: React.ReactNode | ReactElement
    logoClassname?: string
    props?: any

}) => {
  return (
    <Button  onClick={async () => await signInWithOAuthAction(provider, redirectRoute)} variant="outline" className='w-full flex items-center justify-center space-x-2' {...props}>
        <div>
          {logo ? logo : provider === "google" ? (
            <GoogleLogo className={logoClassname} />
          ) : null}
        </div>
        <p>{children}</p>
    </Button>
  )
}

export default OAuthButton