import { DateTime } from 'luxon';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ConsumedProduct, getTotals, Product } from '~models';
import { getConsumedProducts, getProducts, updateConsumedProduct, deleteConsumedProduct } from '~services/api';
import { AppState, setProducts } from '~store';
import { isInRange } from '~utils';

import ProductSelect from './product-select';

export interface HourProps {
  readonly dateTime: string;
}

export function Hour(props: HourProps): React.ReactElement {
  const startDateTime = DateTime.fromISO(props.dateTime).startOf('hour');
  const endDateTime = startDateTime.plus({ hours: 1 });

  const startDateTimeISO = startDateTime.toISO();
  const endDateTimeISO = endDateTime.toISO();

  // Load products for selects.
  const dispatch = useDispatch();
  const products = useSelector<AppState, Product[]>(state => state.products);
  useEffect(() => {
    async function fetchData(): Promise<void> {
      const response = await getProducts();

      dispatch(setProducts(response.items));
    }

    if (!products.length) {
      fetchData();
    }
  }, [dispatch, products.length]);

  // TODO: request consumed products only for a hour.
  const [consumed, setConsumed] = useState<ConsumedProduct[]>([]);
  useEffect(() => {
    async function fetchData(): Promise<void> {
      const response = await getConsumedProducts();
      const hourConsumed = response.items.filter(consumed => isInRange(startDateTimeISO, endDateTimeISO, consumed.timestamp));
      hourConsumed.sort((consumedA, consumedB) => {
        const consumedATimestamp = DateTime.fromISO(consumedA.timestamp).toSeconds();
        const consumedBTimestamp = DateTime.fromISO(consumedB.timestamp).toSeconds();

        return consumedATimestamp - consumedBTimestamp;
      });

      setConsumed(hourConsumed);
    }

    fetchData();
  }, [startDateTimeISO, endDateTimeISO]);

  async function onProductChange(
    event: React.ChangeEvent<HTMLSelectElement>,
    index: number,
    consumedProduct: ConsumedProduct,
    productId: string,
  ): Promise<void> {
    const product = products.find(product => product.id === productId);
    if (!product) {
      return;
    }

    const consumedProducts = [...consumed];
    consumedProducts[index] = { ...consumedProduct, productId, product };
    setConsumed(consumedProducts);

    // TODO: handle errors.
    await updateConsumedProduct({
      id: consumedProduct.id,
      productId,
      weight: consumedProduct.weight,
      timestamp: consumedProduct.timestamp,
    });
  }

  async function onWeightChange(
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    consumedProduct: ConsumedProduct,
    weight: number,
  ): Promise<void> {
    const consumedProducts = [...consumed];
    consumedProducts[index] = { ...consumedProduct, weight };
    setConsumed(consumedProducts);

    // TODO: handle errors.
    await updateConsumedProduct({
      id: consumedProduct.id,
      productId: consumedProduct.productId,
      weight,
      timestamp: consumedProduct.timestamp,
    });
  }

  async function onDeleteClick(
    event: React.MouseEvent,
    index: number,
    consumedProduct: ConsumedProduct,
  ): Promise<void> {
    // TODO: handle errors.
    await deleteConsumedProduct(consumedProduct.id);

    const consumedProducts = [...consumed];
    consumedProducts.splice(index, 1);
    setConsumed(consumedProducts);
  }

  const rows = consumed.map((consumed, index) => {
    const totals = getTotals([consumed]);

    return (
      <tr className="table__row" key={consumed.id}>
        <th className="table__cell table__cell--no-spacing" scope="row">
          <ProductSelect productID={consumed.productId}
            onChange={(event, productID): Promise<void> => onProductChange(event, index, consumed, productID)} />
          <span></span>
        </th>

        <td className="table__cell table__cell--no-spacing">
          <label>
            <input type="number" value={consumed.weight}
              onChange={(event): Promise<void> => onWeightChange(event, index, consumed, +event.target.value)} />
            <span>g</span>
          </label>
        </td>

        <td className="table__cell">{totals.protein.toFixed()} g</td>
        <td className="table__cell">{totals.fat.toFixed()} g</td>
        <td className="table__cell">{totals.carbohydrates.toFixed()} g</td>
        <td className="table__cell">{totals.calories.toFixed()} kcal</td>

        <td className="table__cell">
          <button className="button button--danger"
            onClick={(event): Promise<void> => onDeleteClick(event, index, consumed)}>
            Delete
          </button>
        </td>
      </tr>
    );
  });

  const hourTotals = getTotals(consumed);

  return (
    <table className="table">
      <thead>
        <tr className="table__row">
          <th className="table__cell">Product</th>
          <th className="table__cell">Weight</th>
          <th className="table__cell">Protein</th>
          <th className="table__cell">Fat</th>
          <th className="table__cell">Carbs</th>
          <th className="table__cell">Calories</th>
          <th className="table__cell"></th>
        </tr>
      </thead>

      <tbody>
        {rows}
      </tbody>

      <tfoot>
        <tr className="table__row">
          <th className="table__cell" scope="row">Total</th>
          <td className="table__cell">{(hourTotals.weight * 1000).toFixed()} g</td>
          <td className="table__cell">{hourTotals.protein.toFixed()} g</td>
          <td className="table__cell">{hourTotals.fat.toFixed()} g</td>
          <td className="table__cell">{hourTotals.carbohydrates.toFixed()} g</td>
          <td className="table__cell">{hourTotals.calories.toFixed()} kcal</td>
          <td className="table__cell"></td>
        </tr>
      </tfoot>
    </table>
  );
}

export default Hour;
