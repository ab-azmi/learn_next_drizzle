"use server";

import { VariantSchema } from "@/types/variant-schema";
import { createSafeActionClient } from "next-safe-action";
import { productVariants, variantImages, variantTags } from "../schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { variantImagesType, VariantTagsType } from "@/lib/infer-types";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

const createVariants = action
  .schema(VariantSchema)
  .action(
    async ({
      parsedInput: {
        color,
        editMode,
        id,
        productID,
        productType,
        tags,
        variantImages: newImages,
      },
    }) => {
      try {
        if (editMode && id) {
          const editVariant = await db
            .update(productVariants)
            .set({
              color,
              productType,
              updated: new Date(),
            })
            .where(
                eq(productVariants.id, id)
            )
            .returning();

          await db
            .delete(variantTags)
            .where(eq(variantTags.variantID, editVariant[0].id));

          await db.insert(variantTags).values(
            tags.map((tag: VariantTagsType) => ({
              tag,
              variantID: editVariant[0].id,
            }))
          );

          await db
            .delete(variantImages)
            .where(eq(variantImages.variantID, editVariant[0].id));

          await db.insert(variantImages).values(
            newImages.map((img: variantImagesType, index: number) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantID: editVariant[0].id,
              order: index,
            }))
          );
          revalidatePath("/dashboard/products");
          return { success: `Edited ${productType}` };
        }

        if (!editMode) {
          const newVariant = await db
            .insert(productVariants)
            .values({
              color,
              productType,
              productID,
            })
            .returning();

          await db.insert(variantTags).values(
            tags.map((tag: VariantTagsType) => ({
              tag,
              variantID: newVariant[0].id,
            }))
          );

          await db.insert(variantImages).values(
            newImages.map((img: variantImagesType, index: number) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantID: newVariant[0].id,
              order: index,
            }))
          );

          revalidatePath("/dashboard/products");
          return { success: `Edited ${productType}` };
        }
      } catch (error) {
        return {error: 'Failed to create variant'}
      }
    }
  );

export default createVariants;
