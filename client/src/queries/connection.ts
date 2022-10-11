import { get } from "./fetch";

export const getConnection = ( callback: React.Dispatch<React.SetStateAction<boolean>> ) => {
    get('/connection', (connection: boolean) => {
        console.log("Connection:\n");
        console.log(connection);
        callback(connection)
    })
}
