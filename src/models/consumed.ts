import Product from './product';

export interface ConsumedProduct {
  readonly id?: string;

  readonly productId: string;
  readonly product: Product;

  readonly weight: number;

  readonly timestamp: string;
}

export default ConsumedProduct;
