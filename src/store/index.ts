import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { products } from './products';

export * from './products';

const reducer = combineReducers({ products });
export const store = configureStore({ reducer });

export type AppState = ReturnType<typeof reducer>;
