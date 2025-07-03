import { z } from "zod";
import { product } from "@/schemas/zod";

export const createProductSchema = product
  .pick({
    name: true,
    description: true,
    price: true,
  })
  .extend({
    imagesBase64: z.array(z.string()),
  })
  .refine(
    (data) => {
      // Allow price to be 0 for free products (Bizu)
      if (data.price === 0 || data.price === null || data.price === undefined) {
        return true;
      }
      // For paid products, price must be greater than 0
      return data.price > 0;
    },
    {
      message: "Preço deve ser maior que zero para produtos pagos",
      path: ["price"],
    }
  );
