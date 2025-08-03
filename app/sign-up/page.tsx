"use client"

import React from 'react'

import AuthPages from '@/components/ui/auth/auth-pages'
import AuthPageSide from '@/components/ui/auth/auth-page-side'

import { z } from "zod"
import { signUpAction } from '../actions'

const SignUp = () => {
    return (
        <AuthPageSide>
            <AuthPages
                fields={["email", "password"]}
                title="Sign Up"
                submitLabel='Sign Up'
                footerLabel='Already have an account?'
                footerLabelLink='Sign In'
                footerLink='/sign-in'
                zodSchema={z.object({email: z.string().email(), password: z.string().min(8, "Password must be 8 characters long or more ")})}
                zodDefault={{email: "", password: ""}}
                submitHandler={signUpAction}
                googleOAuth
                OAuthClassname='fill-black'
            />
        </AuthPageSide>
    )
}

export default SignUp