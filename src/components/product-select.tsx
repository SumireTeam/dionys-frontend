import React from 'react';
import { useSelector } from 'react-redux';

import { Product } from '~models';
import { AppState } from '~store';

export interface ProductSelectProps {
  readonly productID: string;

  readonly onChange?: (event: React.ChangeEvent<HTMLSelectElement>, productID: string) => void;
}

export function ProductSelect(props: ProductSelectProps): React.ReactElement {
  const products = useSelector<AppState, Product[]>(state => state.products);

  const options = products.map(product => {
    return (
      <option key={product.id} value={product.id}>{product.name}</option>
    );
  });

  function onChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    const { onChange } = props;
    if (onChange) {
      onChange(event, event.target.value);
    }
  }

  return (
    <select value={props.productID} onChange={onChange}>
      {options}
    </select>
  );
}

export default ProductSelect;
