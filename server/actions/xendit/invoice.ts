"use server";
import { xenditClient } from "@/lib/xendit-client";
import {
  paymentCartSchema,
  paymentIntentSchema,
} from "@/types/payment-intent-schema";
import { createSafeActionClient } from "next-safe-action";
import {
  CreateInvoiceRequest,
  Invoice as InvoiceModel,
  InvoiceItem,
  CustomerObject,
  AddressObject,
  InvoiceFee,
  NotificationPreference,
  NotificationChannel,
} from "xendit-node/invoice/models";
import {
  PaymentRequestParameters,
  PaymentRequest as PaymentRequestModel,
} from "xendit-node/payment_request/models";
import {
  PaymentMethodParameters,
  PaymentMethod as PaymentMethodModel,
} from "xendit-node/payment_method/models";
import {
  Customer as CustomerModel,
  CustomerRequest,
} from "xendit-node/customer/models";
import { randomUUID } from "crypto";
import { auth } from "@/server/auth";
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { users } from "@/server/schema";
import { z } from "zod";

const { Invoice, PaymentRequest, PaymentMethod, Customer } = xenditClient;
const action = createSafeActionClient();

export const createXenditInvoice = action
  .schema(paymentIntentSchema)
  .action(async ({ parsedInput: { amount, cart, currency } }) => {
    //FLOW
    //create xendit customer
    //shopping
    //create invoice (amount, id, currency, customer, etc)
    //get invoice url
    //create payment method (customer_id)
    //user choose payment method
    //invoice is paid

    // const customerData: CustomerRequest = {
    //     "referenceId": `demo-${randomUUID()}`,
    //     "type": "INDIVIDUAL",
    //     "individualDetail": {
    //         "givenNames": "Budiantorowijoyokusumo",
    //         "surname": "Doe"
    //     },
    //     "email": "padivaw582@albarulo.com",
    //     "mobileNumber": "+628774494404",
    // }

    //get logged in user
    const user = await auth();
    if (!user) return { error: "User not authenticated" };

    //get user
    const userQuery = await db.query.users.findFirst({
      where: eq(users.id, user.user.id),
    });
    if (!userQuery) return { error: "User not found" };
    var customerID = userQuery.customerID;

    if (!userQuery.customerID) {
      const customerData: CustomerRequest = {
        referenceId: userQuery.id!,
        type: "INDIVIDUAL",
        individualDetail: {
          givenNames: userQuery.name!,
          surname: userQuery.name!,
        },
        email: userQuery.email!,
      };

      const newCustomer: CustomerModel = await Customer.createCustomer({
        data: customerData,
      });

      const newUser = await db
        .update(users)
        .set({
          customerID: newCustomer.id,
        })
        .where(eq(users.id, userQuery.id!))
        .returning();

      customerID = newUser[0].customerID;
    }

    const customer: CustomerModel = await Customer.getCustomer({
      id: customerID!,
    });

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

    const items: InvoiceItem[] = cart.map(
      (item: z.infer<typeof paymentCartSchema>) => {
        return {
          name: item.title,
          price: item.price,
          quantity: item.quantity,
        };
      }
    );
    
    const address: AddressObject = {
      country: "ID",
      streetLine1: "Jalan 1",
      streetLine2: "Jalan 2",
      city: "Jakarta",
      province: "DKI Jakarta",
      state: "DKI Jakarta",
      postalCode: "12345",
    };

    const custObj: CustomerObject = {
      id: customer.id,
      email: customer.email,
      givenNames: customer.individualDetail?.givenNames,
      surname: customer.individualDetail?.surname,
      customerId: customer.referenceId,
    };

    const fees: InvoiceFee[] = [
      {
        type: "TAX",
        value: 800,
      },
      {
        type: "Bulshit",
        value: 900,
      },
    ];

    const channels: NotificationChannel[] = ["email"];

    const notifications: NotificationPreference = {
      invoicePaid: channels,
    };

    const data: CreateInvoiceRequest = {
      amount: amount,
      invoiceDuration: "172800",
      externalId: `invr-${randomUUID()}`,
      description: "Payment for T-Shirt and Pants",
      currency: "IDR",
      reminderTime: 1,
      successRedirectUrl: "http://localhost:3000/",
      customer: custObj,
      items: items,
      fees: fees,
      customerNotificationPreference: notifications,
      payerEmail: customer.email!,
      shouldSendEmail: true,
    };

    const response = await Invoice.createInvoice({
      data,
    });

    // const response: PaymentRequestModel = await PaymentRequest.createPaymentRequest({data})

    // const response: PaymentMethodModel = await PaymentMethod.createPaymentMethod({
    //     data
    // })

    console.log(response);
    return { success: response };
  });
