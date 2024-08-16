"use client"

import { useCartStore } from "@/lib/client-store";
import { AddressElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { Button } from "../ui/button";
import { useState } from "react";
import { createPaymentIntent } from "@/server/actions/create-payment-intent";
import { useAction } from "next-safe-action/hooks";
import { createOrder } from "@/server/actions/create-orders";
import { toast } from "sonner";
import { createXenditInvoice } from "@/server/actions/xendit/invoice";
import { useRouter } from "next/navigation";

export default function PaymentForm(
    { totalPrice }: { totalPrice: number }
) {
    const stripe = useStripe();
    const elements = useElements();
    const { cart, setCheckoutProgress, clearCart } = useCartStore();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const { execute } = useAction(createOrder, {
        onSuccess: (res) => {
            if (res?.data?.error) {
                toast.error(res.data.error);
                setIsLoading(false);
                return;
            }
            if (res?.data?.success) {
                toast.success(res.data.success);
                setIsLoading(false);
                //redirect to confirmation page
                setCheckoutProgress('confirmation-page');
                //clear cart
                clearCart();
            }
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // setIsLoading(true);
        //check if stripe and elements are loaded
        // if (!stripe || !elements) {
        //     setIsLoading(false);
        //     return;
        // }
        // //check if stripe is ready
        // const { error: submitError } = await elements.submit();
        // if (submitError) {
        //     setErrorMessage(submitError.message!);
        //     setIsLoading(false);
        //     return;
        // }

        //payment intent
        const res = await createXenditInvoice({
            amount: totalPrice,
            currency: 'usd',
            cart: cart.map(item => ({
                quantity: item.variant.quantity,
                productID: item.id,
                title: item.name,
                price: item.price,
                image: item.image
            }))
        })

        if(res?.data?.success){
            //checkProgress new state (paying)
            //redirect to invoice url to new page
            // router.push(res.data.success.invoiceUrl);
            
        }

        // if (res?.data?.error) {
        //     setErrorMessage(res.data.error);
        //     setIsLoading(false);
        //     return;
        // }
        //if payment intent is successful
        // if (res?.data?.success) {
        //     //confirm payment
        //     const { error } = await stripe.confirmPayment({
        //         elements,
        //         clientSecret: res.data.success.clientSecretID!,
        //         redirect: "if_required",
        //         confirmParams: {
        //             return_url: "http://localhost:3000/success",
        //             receipt_email: res.data.success.user as string
        //         }
        //     })

        //     if (error) {
        //         setErrorMessage(error.message!);
        //         setIsLoading(false);
        //         return;
        //     } else {
        //         //if confirm payment is successful
        //         //create order in DB
        //         setIsLoading(false);
        //         execute({
        //             status: 'pending',
        //             total: totalPrice/100,
        //             paymentIntentID: res.data.success.paymentIntentID!,
        //             products: cart.map(item => ({
        //                 productID: item.id,
        //                 variantID: item.variant.variantID,
        //                 quantity: item.variant.quantity
        //             }))
        //         })
        //     }
        // }
    }

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <AddressElement options={{ mode: 'shipping' }} />
            <Button
                type="submit"
                className=" my-4 w-full"
                disabled={!stripe || !elements || isLoading}>
                {isLoading ? 'Processing...' : 'Pay'}
            </Button>
        </form>
    )
}