import { Models } from "@rematch/core";
import {access} from "./user";

export interface RootModel extends Models<RootModel> {
    access: typeof access;
}

export const models: RootModel = { access: access };