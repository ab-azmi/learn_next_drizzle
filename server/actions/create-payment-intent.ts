'use server'

import { auth } from '@/server/auth';
import { paymentIntentSchema } from '@/types/payment-intent-schema';
import { createSafeActionClient } from 'next-safe-action'
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET!)
const action = createSafeActionClient();

export const createPaymentIntent = action
    .schema(paymentIntentSchema)
    .action(async({parsedInput: {amount, cart, currency}}) => {
        const user = await auth();
        if(!user) return {error: 'Please login to continue'}
        if(!amount) return {error: 'No products in cart'}

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                cart: JSON.stringify(cart),
            }
        })


        return {
            success: {
                paymentIntentID: paymentIntent.id,
                clientSecretID: paymentIntent.client_secret,
                user: user.user.email,
            }
        }
    })