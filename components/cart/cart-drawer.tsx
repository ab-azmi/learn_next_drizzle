'use client'

import { useCartStore } from "@/lib/client-store"
import { ShoppingCart } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { AnimatePresence, motion } from "framer-motion";
import CartItems from "./cart-items";
import CartMessage from "./cart-message";
import OrderConfirmation from "./order-confirmation";
import CartProgress from "./cart-progress";
import XenditPayment from "./xendit-payment/payment";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { updateStatusOrder } from "@/server/actions/update-status-order";

export default function CartDrawer() {
    const { cart, clearCart, unpayedInvoice, checkoutProgress, setCheckoutProgress, cartOpen, setCartOpen } = useCartStore();
    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.variant.quantity, 0);

    const params = useSearchParams();
    const invoiceStatus = params.get('status');
    const invoiceID = params.get('invoice_id');

    
    const handleUpdateStatusOrder = async (status: string, invoiceID: string) => {
        await updateStatusOrder({
            status,
            invoiceID
        }).then(() => {
            console.log('Order status updated');
        })
        .catch((error) => {
            console.log(error);
        });
    }
    
    useEffect(() => {
        // const invoice = db.query.invoices.findFirst({});
        if (invoiceStatus === 'success') {
            clearCart();
            setCheckoutProgress('confirmation-page');
            handleUpdateStatusOrder('succeeded', invoiceID ?? '');
        }
    }, [invoiceStatus, setCheckoutProgress, clearCart, invoiceID])

    return (
        <div>
            <Drawer open={cartOpen} onOpenChange={setCartOpen}>
                <DrawerTrigger>
                    <div className="relative px-2">
                        <AnimatePresence>
                            {cart.length > 0 && (
                                <motion.span
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="text-xs absolute -top-2 -right-2 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center">
                                    {cart.length}
                                </motion.span>
                            )}
                        </AnimatePresence>
                        <ShoppingCart />
                    </div>
                </DrawerTrigger>
                <DrawerContent className="fixed bottom-0 left-0 max-h-[70vh] min-h-[50vh]">
                    <DrawerHeader className="flex flex-col justify-center items-center">
                        <CartMessage />
                    </DrawerHeader>
                    <CartProgress />
                    <div className="overflow-auto p-4">
                        {checkoutProgress === "cart-page" && <CartItems />}
                        {checkoutProgress === "payment-page" && <XenditPayment totalPrice={totalPrice} />}
                        {checkoutProgress === "confirmation-page" && <OrderConfirmation />}
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    )
}