"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema } from "../schemas";
import { z } from "zod";
import { useRef, useState } from "react";
import Image from "next/image";
import { postProduct } from "../actions";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

type FormData = z.infer<typeof createProductSchema>;

export default function AddProduct() {
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, isPending } = useSession();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(createProductSchema),
  });
  
  const imagesBase64 = watch("imagesBase64");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Update the form data with current images
      const formDataWithImages = {
        ...data,
        imagesBase64: images,
      };
      
      const result = await postProduct(formDataWithImages);
      
      if (result.success) {
        // Redirect to my products page
        router.push("/my-products");
      } else {
        setError("Erro ao criar produto. Tente novamente.");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      setError("Erro ao criar produto. Verifique os dados e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setImages((prev) => [...prev, base64String]);
          setValue("imagesBase64", [...images, base64String]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDeleteImage = (indexToDelete: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToDelete));
    setValue(
      "imagesBase64",
      images.filter((_, index) => index !== indexToDelete)
    );
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Mostrar loading se sessão ainda está carregando
  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7A6FF0] mx-auto mb-4"></div>
          <div className="text-gray-500">Carregando...</div>
        </div>
      </div>
    );
  }

  // Mostrar login se não estiver autenticado
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 text-center">
          <h2 className="text-lg font-semibold text-[#27005D] mb-4">
            Acesso Necessário
          </h2>
          <p className="text-gray-500 mb-4">
            Você precisa estar logado para criar produtos.
          </p>
          <Link href="/login">
            <Button className="w-full bg-[#7A6FF0] text-white">
              Fazer Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Tabs */}
      <div className="flex mb-6">
        <div className="w-1/2 bg-white py-3 text-center rounded-l-full shadow-sm font-medium">Pago</div>
        <div className="w-1/2 bg-[#27005D] py-3 text-center rounded-r-full text-white shadow-sm font-medium">Bizu</div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px-6">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Add Photos */}
        <div className="mb-6">
          <p className="text-center font-medium text-lg mb-4">Adicionar fotos</p>

          {/* Image Preview Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square relative rounded-lg overflow-hidden">
                    <Image src={image} alt={`Preview ${index + 1}`} fill className="object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          <div className="flex justify-center">
            <label className="w-16 h-16 bg-[#27005D] rounded-xl flex items-center justify-center cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </label>
          </div>

          {images.length > 0 && (
            <p className="text-center mt-2 text-sm text-gray-600">
              {images.length} {`image${images.length === 1 ? "m" : "ns"}`} selecionada
              {`${images.length === 1 ? "" : "s"}`}
            </p>
          )}
        </div>

        {/* Rest of the form remains the same */}
        <div className="space-y-4">
          <div>
            <Input
              {...register("name")}
              type="text"
              placeholder="Nome do produto"
              className="bg-gray-100 border-gray-200 rounded-md px-4 py-3 h-12"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <textarea
              {...register("description")}
              placeholder="Descrição"
              className="w-full bg-gray-100 border border-gray-200 rounded-md px-4 py-3 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-[#27005D]"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <Input
              {...register("price", { valueAsNumber: true })}
              type="number"
              step="0.01"
              placeholder="Preço R$"
              className="bg-gray-100 border-gray-200 rounded-md px-4 py-3 h-12"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col items-center">
          <Button 
            type="submit" 
            className="w-full bg-[#27005D] text-white rounded-full py-6 h-12 font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Criando produto..." : "Finalizar"}
          </Button>
          <Link href="/my-products" className="mt-3 text-[#27005D]">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
