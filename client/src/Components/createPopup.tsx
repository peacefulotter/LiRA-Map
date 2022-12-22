import { useState } from 'react';
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import '@sweetalert2/theme-dark';

/*/** @author Martin Nielsen s174971 * */

const swal = withReactContent(Swal);

const createPopup = <T,>() => {
  return (
    options: SweetAlertOptions<any, any>,
  ): Promise<SweetAlertResult<T>> => {
    return swal.fire({
      ...options,
      customClass: {
        // css class overriding swalalert2 classes
        popup: 'sweetalert-popup',
        title: 'sweetalert-title',
        actions: 'sweetalert-actions',
        htmlContainer: 'sweetalert-htmlContainer',
      },
      heightAuto: false,
    });
  };
};

export default createPopup;
