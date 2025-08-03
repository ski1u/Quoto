"use client"

import React from 'react'

import AuthPages from '@/components/ui/auth/auth-pages'
import AuthPageSide from '@/components/ui/auth/auth-page-side'

import { z } from "zod"
import { signInAction } from '../actions'

const SignIn = () => {
    return (
        <AuthPageSide>
            <AuthPages
                fields={["email", "password"]}
                title="Sign In"
                submitLabel='Sign In'
                footerLabel='Dont have an account?'
                footerLabelLink='Sign Up'
                footerLink='/sign-up'
                zodSchema={z.object({email: z.string().email(), password: z.string().min(8, "Password must be 8 characters long or more ")})}
                zodDefault={{email: "", password: ""}}
                submitHandler={signInAction}
                googleOAuth
                OAuthClassname='fill-black'
                forgotPassword
                />
        </AuthPageSide>
    )
}

export default SignIn