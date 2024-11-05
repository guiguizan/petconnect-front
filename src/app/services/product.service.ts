import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductResponseDto {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  sku: string;
  category: string;
  tags: string[];
  images: string[];
  active: boolean;
}

export interface InsertProductRequestDto {
  name: string;
  price: number;
  quantity: number;
  description: string;
  sku: string;
  category: string;
  tags: string[];
  active: boolean;
}

export interface SortObject {
  direction: string;
  nullHandling: string;
  ascending: boolean;
  property: string;
  ignoreCase: boolean;
}

export interface PageableObject {
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: SortObject[];
  unpaged: boolean;
}

export interface PageProductResponseDto {
  totalElements: number;
  totalPages: number;
  pageable: PageableObject;
  size: number;
  content: ProductResponseDto[];
  number: number;
  sort: SortObject[];
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'https://pet-connect-postgree-27f454547a44.herokuapp.com/api/v1/product';

  constructor(private http: HttpClient) {}

  // Get product by ID
  getProductById(id: number): Observable<ProductResponseDto> {
    return this.http.get<ProductResponseDto>(`${this.baseUrl}/${id}`);
  }

  // Get all products with pagination
  getAllProducts(
    page: number,
    size: number,
    query?: string,
    sort?: string[]
  ): Observable<PageProductResponseDto> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
  
    if (query) {
      params = params.set('query', query);
    }
  
    if (sort && sort.length > 0) {
      sort.forEach((sortValue) => {
        params = params.append('sort', sortValue);
      });
    }
  
    return this.http.get<PageProductResponseDto>(this.baseUrl, { params });
  }
  

  // Create a new product with image upload
  createProduct(
    productData: InsertProductRequestDto,
    imageFile: File
  ): Observable<ProductResponseDto> {
    const formData = new FormData();
    formData.append(
      'product',
      new Blob([JSON.stringify(productData)], { type: 'application/json' })
    );
    formData.append('image', imageFile);

    return this.http.post<ProductResponseDto>(this.baseUrl, formData);
  }

  // Update product by ID
  updateProduct(
    id: number,
    productData: InsertProductRequestDto
  ): Observable<ProductResponseDto> {
    return this.http.put<ProductResponseDto>(
      `${this.baseUrl}/${id}`,
      productData
    );
  }

  // Delete product by ID
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  
  updateProductWithImage(
    id: number,
    productData: InsertProductRequestDto,
    imageFile: File
  ): Observable<ProductResponseDto> {
    const formData = new FormData();

    const formattedProductData = {
      ...productData,
      tags: Array.isArray(productData.tags) ? productData.tags : [productData.tags],
    };

    formData.append('product', JSON.stringify(formattedProductData));
    formData.append('image', imageFile, imageFile.name);

    return this.http.put<ProductResponseDto>(`${this.baseUrl}/${id}`, formData);
  }

}
