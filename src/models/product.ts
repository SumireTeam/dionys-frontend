export interface Product {
  readonly id?: string;

  readonly name: string;
  readonly description: string;

  readonly calories: number;

  readonly protein: number;
  readonly fat: number;
  readonly carbohydrates: number;
}

export default Product;
