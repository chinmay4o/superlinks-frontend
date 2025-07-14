import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const productService = {
  // Get user's products
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get single product by ID
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get product by slug
  getProductBySlug: async (slug) => {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },

  // Get public products by username
  getPublicProducts: async (username, params = {}) => {
    const response = await api.get(`/products/public/${username}`, { params });
    return response.data;
  },

  // Create new product
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete (archive) product
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Upload files
  uploadFiles: async (files, productId = null) => {
    const formData = new FormData();
    
    if (Array.isArray(files)) {
      files.forEach((file) => {
        formData.append('files', file);
      });
    } else {
      formData.append('files', files);
    }
    
    if (productId) {
      formData.append('productId', productId);
    }

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload cover image
  uploadCoverImage: async (imageFile, productId = null) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('type', 'cover');
    
    if (productId) {
      formData.append('productId', productId);
    }

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Create product with files
  createProductWithFiles: async (productData, coverImage, productFiles) => {
    try {
      let coverImageData = null;
      let filesData = [];

      // Upload cover image first
      if (coverImage) {
        const coverResponse = await productService.uploadCoverImage(coverImage);
        coverImageData = coverResponse.files[0];
      }

      // Upload product files
      if (productFiles && productFiles.length > 0) {
        const filesResponse = await productService.uploadFiles(productFiles);
        filesData = filesResponse.files;
      }

      // Create product data with uploaded file references
      const finalProductData = {
        ...productData,
        images: {
          cover: coverImageData ? {
            url: coverImageData.url,
            key: coverImageData.key,
            alt: productData.title
          } : null,
          gallery: []
        },
        files: filesData.map(file => ({
          name: file.originalName,
          url: file.url,
          key: file.key,
          size: file.size,
          type: file.mimetype,
          isPreview: false
        }))
      };

      // Create the product
      const response = await productService.createProduct(finalProductData);
      return response;
    } catch (error) {
      console.error('Error creating product with files:', error);
      throw error;
    }
  },

  // Update product with files
  updateProductWithFiles: async (id, productData, coverImage, productFiles) => {
    try {
      let coverImageData = null;
      let filesData = [];

      // Upload cover image if provided
      if (coverImage) {
        const coverResponse = await productService.uploadCoverImage(coverImage, id);
        coverImageData = coverResponse.files[0];
      }

      // Upload product files if provided
      if (productFiles && productFiles.length > 0) {
        const filesResponse = await productService.uploadFiles(productFiles, id);
        filesData = filesResponse.files;
      }

      // Prepare updated product data
      const finalProductData = { ...productData };

      // Add cover image if uploaded
      if (coverImageData) {
        finalProductData.images = {
          ...finalProductData.images,
          cover: {
            url: coverImageData.url,
            key: coverImageData.key,
            alt: productData.title
          }
        };
      }

      // Add new files if uploaded
      if (filesData.length > 0) {
        const newFiles = filesData.map(file => ({
          name: file.originalName,
          url: file.url,
          key: file.key,
          size: file.size,
          type: file.mimetype,
          isPreview: false
        }));
        
        finalProductData.files = [
          ...(finalProductData.files || []),
          ...newFiles
        ];
      }

      // Update the product
      const response = await productService.updateProduct(id, finalProductData);
      return response;
    } catch (error) {
      console.error('Error updating product with files:', error);
      throw error;
    }
  }
};

export default productService;