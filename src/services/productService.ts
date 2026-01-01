import type { Product, ProductsResponse, ProductFormData, ApiError } from '../types/product';

const API_BASE_URL = 'https://dummyjson.com';

class ProductService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = {
        message: `HTTP error! status: ${response.status}`,
        status: response.status,
      };
      throw error;
    }
    return response.json();
  }

  async getAllProducts(limit: number = 30, skip: number = 0): Promise<ProductsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/products?limit=${limit}&skip=${skip}`);
      return this.handleResponse<ProductsResponse>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProductById(id: number): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      return this.handleResponse<Product>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async searchProducts(query: string): Promise<ProductsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
      return this.handleResponse<ProductsResponse>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createProduct(productData: ProductFormData): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      return this.handleResponse<Product>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProduct(id: number, productData: Partial<ProductFormData>): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      return this.handleResponse<Product>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteProduct(id: number): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
      return this.handleResponse<Product>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/categories`);
      return this.handleResponse<string[]>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): ApiError {
    if (error instanceof Error) {
      return {
        message: error.message,
      };
    }
    return {
      message: 'An unknown error occurred',
    };
  }
}

export const productService = new ProductService();
