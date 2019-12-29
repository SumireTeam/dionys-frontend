import ConsumedProduct from './consumed';

export interface Totals {
  readonly weight: number;

  readonly protein: number;
  readonly fat: number;
  readonly carbohydrates: number;

  readonly calories: number;
}

export function getTotals(consumed: ConsumedProduct[]): Totals {
  const totals: Totals = {
    weight: 0,
    protein: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
  };

  return consumed.reduce((total, { product, weight }) => {
    return {
      weight: total.weight + weight / 1000,
      protein: total.protein + product.protein * weight / 100,
      fat: total.fat + product.fat * weight / 100,
      carbohydrates: total.carbohydrates + product.carbohydrates * weight / 100,
      calories: total.calories + product.calories * weight / 100,
    };
  }, totals);
}
