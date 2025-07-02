"use server";

import { S3Lib } from "@/lib/s3-lib";
import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import prisma from "@/lib/prisma";
import { createProductSchema } from "./schemas";
import { z } from "zod";

export const getProducts = async (userId: string) => {
  const s3Lib = S3Lib.getInstance();
  const command = await s3Lib.client.send(new ListObjectsV2Command({ Bucket: "h8x", Prefix: "products-image/" }));
  let continuationToken = null;
  let allObjects: any[] = [];

  do {
    const response = await s3Lib.client.send(new ListObjectsV2Command({ Bucket: "h8x", Prefix: "products-image/" }));

    if (response.Contents) {
      allObjects = allObjects.concat(response.Contents);
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);
  // const products = await s3Lib.client.send(
  //   new GetObjectCommand({
  //     Bucket: "h8x",
  //     Key: "products-image/camera.jpg",
  //   })
  // );
  // const blobImage = await products.Body?.transformToString("base64");
  // const base64Image = `data:image/jpeg;base64,${blobImage}`;
  // return base64Image;
  return allObjects;
};

export const postProduct = async (product: z.infer<typeof createProductSchema>) => {
  //mocked user id
  const userId = "123";
  // 1. Validate the product
  const validatedProduct = createProductSchema.parse(product);
  // 2. Upload the image to S3
  const s3Lib = S3Lib.getInstance();
  validatedProduct.imagesBase64.forEach(async (image, index) => {
    await s3Lib.client.send(
      new PutObjectCommand({
        Bucket: "h8x",
        Key: `products-image/${validatedProduct.name}-${index}`,
        Body: image,
      })
    );
  });
  // 3. Create the product
  const createdProduct = await prisma.product.create({
    data: {
      name: validatedProduct.name,
      description: validatedProduct.description,
      price: validatedProduct.price,
      s3UrlImage: `products-image/${validatedProduct.name}`,
      sellerId: userId,
    },
  });
};
