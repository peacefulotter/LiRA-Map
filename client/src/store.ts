import { init, RematchDispatch, RematchRootState } from "@rematch/core";
import { models, RootModel } from "./models";
import storage from "redux-persist/lib/storage";
import persist from '@rematch/persist'

export const store = init<RootModel>({
    models,
    plugins: [
        persist({
            key: 'persist-storage',
            storage,
            whitelist: ['user'], // only persist the user model
        }),
    ],
})


export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;