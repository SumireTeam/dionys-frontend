import Axios from 'axios';

import config from '~config';
import { ConsumedProduct } from '~models';

export interface ConsumedProductsRequest {
  readonly page?: number;
  readonly elementsPerPage?: number;
}

export interface ConsumedProductsResponse {
  readonly elements: number;
  readonly items: ConsumedProduct[];
}

export async function getConsumedProducts(request: ConsumedProductsRequest = {}): Promise<ConsumedProductsResponse> {
  const url = `${config.apiURL}/consumedproducts`;
  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  const response = await Axios.get<ConsumedProductsResponse>(url, { headers, data: request });
  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  return response.data;
}

export interface UpdateConsumedProductRequest {
  readonly id: string;
  readonly productId: string;
  readonly weight: number;
  readonly timestamp: string;
}

export async function updateConsumedProduct(request: UpdateConsumedProductRequest): Promise<void> {
  const url = `${config.apiURL}/consumedproducts/${request.id}`;
  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  const response = await Axios.put(url, request, { headers });
  if (response.status !== 204) {
    throw new Error(response.statusText);
  }
}

export async function deleteConsumedProduct(id: string): Promise<void> {
  const url = `${config.apiURL}/consumedproducts/${id}`;
  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  const response = await Axios.delete(url, { headers });
  if (response.status !== 204) {
    throw new Error(response.statusText);
  }
}
