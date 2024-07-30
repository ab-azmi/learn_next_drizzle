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