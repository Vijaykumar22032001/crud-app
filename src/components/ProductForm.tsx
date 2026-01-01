import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from './form/Input';
import { Select } from './form/Select';
import { TextArea } from './form/TextArea';
import type { Product, ProductFormData } from '../types/product';
import { productService } from '../services/productService';

const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  discountPercentage: z.number().min(0, 'Discount must be 0 or greater').max(100, 'Discount cannot exceed 100%'),
  rating: z.number().min(0, 'Rating must be 0 or greater').max(5, 'Rating cannot exceed 5'),
  stock: z.number().int('Stock must be a whole number').min(0, 'Stock cannot be negative'),
  brand: z.string().min(2, 'Brand must be at least 2 characters'),
  category: z.string().min(1, 'Please select a category'),
});

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ProductForm = ({ product, onSubmit, onCancel, isSubmitting = false }: ProductFormProps) => {
  const [categories, setCategories] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          title: product.title,
          description: product.description,
          price: product.price,
          discountPercentage: product.discountPercentage,
          rating: product.rating,
          stock: product.stock,
          brand: product.brand,
          category: product.category,
        }
      : {
          price: 0,
          discountPercentage: 0,
          rating: 0,
          stock: 0,
        },
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await productService.getCategories();
        const categoriesArray = Array.isArray(cats) ? cats : [];
        const stringCategories = categoriesArray.map(cat =>
          typeof cat === 'string' ? cat : cat.slug || cat.name || String(cat)
        );
        setCategories(stringCategories);
      } catch (error) {
        console.error('Failed to load categories:', error);
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  const categoryOptions = categories.map((cat) => {
    const categoryStr = String(cat);
    return {
      value: categoryStr,
      label: categoryStr.charAt(0).toUpperCase() + categoryStr.slice(1).replace(/-/g, ' '),
    };
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Product Title"
        {...register('title')}
        error={errors.title?.message}
        required
        disabled={isSubmitting}
      />

      <TextArea
        label="Description"
        {...register('description')}
        error={errors.description?.message}
        required
        disabled={isSubmitting}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price"
          type="number"
          step="0.01"
          {...register('price', { valueAsNumber: true })}
          error={errors.price?.message}
          required
          disabled={isSubmitting}
        />

        <Input
          label="Discount %"
          type="number"
          step="0.01"
          {...register('discountPercentage', { valueAsNumber: true })}
          error={errors.discountPercentage?.message}
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Stock"
          type="number"
          {...register('stock', { valueAsNumber: true })}
          error={errors.stock?.message}
          required
          disabled={isSubmitting}
        />

        <Input
          label="Rating"
          type="number"
          step="0.1"
          max="5"
          {...register('rating', { valueAsNumber: true })}
          error={errors.rating?.message}
          disabled={isSubmitting}
        />
      </div>

      <Input
        label="Brand"
        {...register('brand')}
        error={errors.brand?.message}
        required
        disabled={isSubmitting}
      />

      <Select
        label="Category"
        {...register('category')}
        options={categoryOptions}
        error={errors.category?.message}
        required
        disabled={isSubmitting}
      />

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};
