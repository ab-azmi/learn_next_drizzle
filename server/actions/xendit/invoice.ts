'use server'
import { xenditClient } from "@/lib/xendit-client";
import { paymentIntentSchema } from "@/types/payment-intent-schema";
import { createSafeActionClient } from "next-safe-action";
import { CreateInvoiceRequest, Invoice as InvoiceModel, InvoiceItem, CustomerObject, AddressObject, InvoiceFee, NotificationPreference, NotificationChannel } from 'xendit-node/invoice/models'
import { PaymentRequestParameters, PaymentRequest as PaymentRequestModel } from 'xendit-node/payment_request/models'
import { PaymentMethodParameters, PaymentMethod as PaymentMethodModel } from 'xendit-node/payment_method/models'
import { Customer as CustomerModel, CustomerRequest } from 'xendit-node/customer/models'
import {randomUUID} from 'crypto'



const { Invoice, PaymentRequest, PaymentMethod, Customer  } = xenditClient;
const action = createSafeActionClient();

export const createXenditInvoice = action
    .schema(paymentIntentSchema)
    .action(async({parsedInput: {amount, cart, currency}}) => {
        //FLOW
        //create xendit customer
        //shopping
        //create invoice (amount, id, currency, customer, etc)
        //get invoice url
        //create payment method (customer_id)
        //user choose payment method
        //invoice is paid

        const customerData: CustomerRequest = {
            "referenceId": `demo-${randomUUID()}`,
            "type": "INDIVIDUAL",
            "individualDetail": {
                "givenNames": "Budiantorowijoyokusumo",
                "surname": "Doe"
            },
            "email": "padivaw582@albarulo.com",
            "mobileNumber": "+628774494404",
        }

        const customer: CustomerModel = await Customer.getCustomer({id: 'cust-5a26404a-1608-43ba-a912-f5b4ac17acf1'})

        // const data: PaymentMethodParameters = {
        //     "reusability" : "MULTIPLE_USE",
        //     "type" : "DIRECT_DEBIT",
        //     "directDebit" : {
        //         "channelProperties" : {
        //         "failureReturnUrl" : "https://redirect.me/failure",
        //         "successReturnUrl" : "https://redirect.me/success"
        //         },
        //         "channelCode" : "BPI"
        //     },
        //     "country": "ID",
        //     "customerId": "test124",
        //}

        // const data: PaymentRequestParameters = {
        //         "amount" : 15000,
        //         "paymentMethod" : {
        //             "ewallet" : {
        //             "channelProperties" : {
        //                 "successReturnUrl" : "https://redirect.me/success"
        //             },
        //             "channelCode" : "SHOPEEPAY"
        //             },
        //             "reusability" : "ONE_TIME_USE",
        //             "type" : "EWALLET"
        //         },
        //         "currency" : "IDR",
        //         "referenceId" : "example-ref-1234"
        //}

        const items: InvoiceItem[] = [
            {
                "name" : "T-Shirt",
                "price" : 10000,
                "quantity" : 1
            },
            {
                "name" : "Pants",
                "price" : 5000,
                "quantity" : 1
            }
        ]

        const address: AddressObject = {
            "country" : "ID",
            "streetLine1" : "Jalan 1",
            "streetLine2" : "Jalan 2",
            "city" : "Jakarta",
            "province" : "DKI Jakarta",
            "state" : "DKI Jakarta",
            "postalCode" : "12345",
        }

        const custObj: CustomerObject = {
            "id": customer.id,
            "phoneNumber": customer.mobileNumber,
            "email": customer.email,
            "givenNames": customer.individualDetail?.givenNames,
            "surname": customer.individualDetail?.surname,
            "customerId": customer.referenceId,
            "addresses": [address],
        }

        const fees: InvoiceFee[] = [
            {
                "type": "TAX",
                "value": 800,
            },
            {
                "type": "Bulshit",
                "value": 900,
            }
        ] 

        const channels: NotificationChannel[] = ["email"]

        const notifications: NotificationPreference = {
            'invoicePaid': channels
        }

        const data: CreateInvoiceRequest = {
            "amount" : 15000,
            "invoiceDuration" : '172800',
            "externalId" : "test1234",
            "description" : "Payment for T-Shirt and Pants",
            "currency" : "IDR",
            "reminderTime" : 1,
            "successRedirectUrl" : "http://localhost:3000/",
            "customer": custObj,
            "items": items,
            "fees": fees
          }

        const response = await Invoice.createInvoice({
            data
        })

        // const response: PaymentRequestModel = await PaymentRequest.createPaymentRequest({data})
        
        // const response: PaymentMethodModel = await PaymentMethod.createPaymentMethod({
        //     data
        // })
        
        console.log(response)
        return {success: response}
    })

