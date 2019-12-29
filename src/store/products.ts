import { createAction, createReducer } from '@reduxjs/toolkit';

import { Product } from '~models';

export const setProducts = createAction<Product[]>('SET_PRODUCTS');

export const products = createReducer<Product[]>([], {
  [setProducts.type]: (state, { payload }) => payload,
});
