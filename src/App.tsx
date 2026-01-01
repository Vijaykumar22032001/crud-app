import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Modal } from './components/Modal';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import { productService } from './services/productService';
import type { Product, ProductFormData } from './types/product';
import './App.css';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await productService.getAllProducts(30);
      setProducts(response.products);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load products';
      setError(message);
      Swal.fire({
        icon: 'error',
        title: 'Error Loading Products',
        text: message,
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (product?: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(undefined);
  };

  const handleCreateProduct = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);

      const optimisticProduct: Product = {
        id: Date.now(),
        ...data,
        thumbnail: 'https://via.placeholder.com/150',
        images: ['https://via.placeholder.com/150'],
      };

      setProducts((prev) => [optimisticProduct, ...prev]);
      handleCloseModal();

      const newProduct = await productService.createProduct(data);

      setProducts((prev) =>
        prev.map((p) => (p.id === optimisticProduct.id ? { ...newProduct, id: optimisticProduct.id } : p))
      );

      Swal.fire({
        icon: 'success',
        title: 'Product Created!',
        text: 'Your product has been successfully created.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      setProducts((prev) => prev.filter((p) => p.id !== Date.now()));

      const message = err instanceof Error ? err.message : 'Failed to create product';
      Swal.fire({
        icon: 'error',
        title: 'Creation Failed',
        text: message,
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (data: ProductFormData) => {
    if (!editingProduct) return;

    const previousProducts = [...products];
    const optimisticProduct: Product = { ...editingProduct, ...data };

    try {
      setIsSubmitting(true);

      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? optimisticProduct : p)));
      handleCloseModal();

      await productService.updateProduct(editingProduct.id, data);

      Swal.fire({
        icon: 'success',
        title: 'Product Updated!',
        text: 'Your changes have been saved successfully.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      setProducts(previousProducts);

      const message = err instanceof Error ? err.message : 'Failed to update product';
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: message,
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      html: `
        <p>You are about to delete:</p>
        <p class="font-semibold mt-2">${product.title}</p>
        <p class="text-sm text-gray-500">This action cannot be undone.</p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      const previousProducts = [...products];

      try {
        setProducts((prev) => prev.filter((p) => p.id !== product.id));

        await productService.deleteProduct(product.id);

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The product has been deleted successfully.',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        setProducts(previousProducts);

        const message = err instanceof Error ? err.message : 'Failed to delete product';
        Swal.fire({
          icon: 'error',
          title: 'Deletion Failed',
          text: message,
          confirmButtonColor: '#3b82f6',
        });
      }
    }
  };

  const handleSubmit = async (data: ProductFormData) => {
    if (editingProduct) {
      await handleUpdateProduct(data);
    } else {
      await handleCreateProduct(data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
              <p className="mt-2 text-gray-600">
                Manage your product catalog with real-time updates
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Product
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <ProductList
            products={products}
            onEdit={handleOpenModal}
            onDelete={handleDeleteProduct}
            isLoading={isLoading}
          />
        </div>

        {error && !isLoading && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
            <button
              onClick={loadProducts}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? 'Edit Product' : 'Create New Product'}
      >
        <ProductForm
          product={editingProduct}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}

export default App;
