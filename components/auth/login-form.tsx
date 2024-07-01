"use client"

import AuthCard from "./auth-card"

const LoginForm = () => {
    return (
        <AuthCard 
            cardTitle="Welcome Back"
            backButtonHref="/auth/register"
            backButtonLabel="Create an account"
            showSocials={true}
            >
                <div>
                    hey
                </div>
            </AuthCard>
    )
}

export default LoginForm