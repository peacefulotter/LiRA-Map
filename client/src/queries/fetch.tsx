
import axios from 'axios'

export const get = (path: string, callback: (data: any) => void): void => {
    fetch(path)
        .then(res => res.json())
        .then(data => callback(data));
}

export const post = (path: string, obj: object, callback: (data: any) => void): void => {
    axios.get(path, {
        params: obj,
        paramsSerializer: params => {
            return  Object.keys(params)
                .map( (key: any) => new URLSearchParams(`${key}=${params[key]}`) )
                .join("&")
        }
    }).then(res => callback(res.data));
}

export const put = (path: string, obj: object ): void => {
    axios.put(path, {
        params: obj
    })
}