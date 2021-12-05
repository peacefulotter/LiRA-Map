import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const swal = withReactContent(Swal)



const usePopup = () => {

    const fire = ( title: string, footer: string ) => {
        swal.fire({
            title: <p>{title}</p>,
            footer: footer,
            didOpen: () => {
                // swal.clickConfirm()
            }
        })
        // }).then(() => {
        //     return swal.fire(<p>Shorthand works too</p>)
        // })
    }
    
    return { fire }
}

export default usePopup
