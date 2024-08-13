import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  serial,
  real,
  index,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";
import { createId } from "@paralleldrive/cuid2";
import { Many, relations } from "drizzle-orm";

export const RoleEnum = pgEnum("roles", ["user", "admin"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").notNull(),
  password: text("password"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  twoFactorEnabled: boolean("twoFactorEnabled").default(false),
  role: RoleEnum("roles").default("user"),
  customerID: text("customerID"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const emailTokens = pgTable("email_tokens", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  token: text("token").notNull(),
  email: text("email").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
  email: text("email").notNull(),
});

export const twoFactorTokens = pgTable("two_factor_tokens", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
  email: text("email").notNull(),
  userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  title: text("title").notNull(),
  created: timestamp('created').defaultNow(),
  price: real('price').notNull(),
});

export const productVariants = pgTable("product_variants", {
  id: serial('id').primaryKey(),
  color: text('color').notNull(),
  productType: text('productType').notNull(),
  updated: timestamp('updated').defaultNow(),
  productID: serial('productID').notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
})

export const variantImages = pgTable("variant_images", {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  size: real('size').notNull(),
  name: text('name').notNull(),
  order: real('order').notNull(),
  variantID: serial('variantID').notNull()
    .references(() => productVariants.id, { onDelete: 'cascade' }),
})

export const variantTags = pgTable('variant_tags', {
  id: serial('id').primaryKey(),
  tag: text('tag').notNull(),
  variantID: serial('variantID').notNull()
    .references(() => productVariants.id, { onDelete: 'cascade' }),
})

export const productRelations = relations(products, ({many}) => ({
  productVariants: many(productVariants, {
    relationName: 'product_variants'
  }),
  reviews: many(reviews, {
    relationName: 'product_reviews'
  })
}))

export const productVariantsRelations = relations(productVariants, ({many, one}) => ({
  product: one(products, {
    fields: [productVariants.productID],
    references: [products.id],
    relationName: 'product_variants'
  }),
  variantImages: many(variantImages, {
    relationName: 'variant_images'
  }),
  variantTags: many(variantTags, {
    relationName: 'variant_tags'
  })
}))

export const variantImagesRelations = relations(variantImages, ({one}) => ({
  productVariants: one(productVariants, {
    fields: [variantImages.variantID],
    references: [productVariants.id],
    relationName: 'variant_images'
  })
}))

export const variantTagsRelations = relations(variantTags, ({one}) => ({
  productVariants: one(productVariants, {
    fields: [variantTags.variantID],
    references: [productVariants.id],
    relationName: 'variant_tags'
  })
}))

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  rating: real('rating').notNull(),
  userID: text('userID').notNull().references(() => users.id, { onDelete: 'cascade' }),
  productID: serial('productID').notNull().references(() => products.id, { onDelete: 'cascade' }),
  comment: text('comment').notNull(),
  created: timestamp('created').defaultNow(),
}, (table) => {
  return {
    productIdx: index('prductIdx').on(table.productID),
    userIdx: index('userIdx').on(table.userID)
  }
})

export const reveiwRelations = relations(reviews, ({one}) => ({
  user: one(users, {
    fields: [reviews.userID],
    references: [users.id],
    relationName: 'user_reviews'
  }),
  product: one(products, {
    fields: [reviews.productID],
    references: [products.id],
    relationName: 'product_reviews'
  })
}))

export const userRealtions = relations(users, ({many}) => ({
  reviews: many(reviews, {relationName: 'user_reviews'}),
  orders: many(orders, {relationName: 'user_orders'})
}))

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userID: text('userID').notNull().references(() => users.id, { onDelete: 'cascade' }),
  total: real('total').notNull(),
  status: text('status').notNull(),
  created: timestamp('created').defaultNow(),
  receiptURL: text('receiptURL'),
  paymentIntentID: text('paymentIntentID'),
})

export const ordersRelations = relations(orders, ({one, many}) => ({
  user: one(users, {
    fields: [orders.userID],
    references: [users.id],
    relationName: 'user_orders'
  }),
  orderProduct: many(orderProduct, {relationName: 'orderProduct'})
}))

export const orderProduct = pgTable('orderProduct', {
  id: serial('id').primaryKey(),
  quantity: integer('quantity').notNull(),
  productVariantID: serial('productVariantID').notNull().references(() => productVariants.id, { onDelete: 'cascade' }),
  orderID: serial('orderID').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productID: serial('productID').notNull().references(() => products.id, { onDelete: 'cascade' }),
})

export const orderProductRelations = relations(orderProduct, ({one}) => ({
  order: one(orders, {
    fields: [orderProduct.orderID],
    references: [orders.id],
    relationName: 'orderProduct'
  }),
  product: one(products, {
    fields: [orderProduct.productID],
    references: [products.id],
    relationName: 'products'
  }),
  productVariant: one(productVariants, {
    fields: [orderProduct.productVariantID],
    references: [productVariants.id],
    relationName: 'productVariants'
  })
}))