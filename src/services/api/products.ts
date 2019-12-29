import Axios from 'axios';

import config from '~config';
import { Product } from '~models';

export interface ProductsRequest {
  readonly page?: number;
  readonly elementsPerPage?: number;
}

export interface ProductsResponse {
  readonly elements: number;
  readonly items: Product[];
}

export async function getProducts(request: ProductsRequest = {}): Promise<ProductsResponse> {
  const url = `${config.apiURL}/products`;
  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  const response = await Axios.get<ProductsResponse>(url, { headers, data: request });
  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  return response.data;
}
