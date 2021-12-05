import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import '@sweetalert2/theme-dark';

const swal = withReactContent(Swal)

const usePopup = () => {
    return ( options: SweetAlertOptions<any, any> ): Promise<SweetAlertResult<any>> => {
        return swal.fire( { ...options, customClass: { popup: 'sweetalert-popup', title: 'sweetalert-title'} } )
    }
}

export default usePopup
