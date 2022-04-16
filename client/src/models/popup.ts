import { SweetAlertOptions, SweetAlertResult } from "sweetalert2";



export type PopupFunc = (options: SweetAlertOptions<any, any>) => Promise<SweetAlertResult<any>>