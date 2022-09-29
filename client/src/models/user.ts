import { createModel } from "@rematch/core";
import { RootModel } from ".";

interface userModel {
    name: string;
    accessToken: string;
    count: number;
}

let userState: userModel = {
    name: "",
    accessToken: "",
    count: 0,
};
export const user = createModel<RootModel>()({
    state: userState, // initial state
    reducers: {
        // handle state changes with pure functions
        setState(state, payload: userModel) {
            return state = payload;
        },
        increment(state, payload: number) {
            return { ...state, count: state.count + payload };
        },
        decrement(state, payload: number) {
            return { ...state, count: state.count - payload };
        }
    },
    // effects: (dispatch) => ({
    //     // handle state changes with impure functions.
    //     // use async/await for async actions
    //     async incrementAsync(payload: number, state) {
    //         console.log("This is current root state", state);
    //         await new Promise((resolve) => setTimeout(resolve, 1000));
    //         dispatch.user.increment(payload);
    //     },
    // }),
});