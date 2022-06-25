
import axios from 'axios'

const getPath = (p: string) => 'http://lirase2.compute.dtu.dk:3002' + p

export const get = (path: string, callback: (data: any) => void): void => {
    fetch(getPath(path))
        .then(res => res.json())
        .then(data => callback(data));
}

export const post = (path: string, obj: object, callback: (data: any) => void): void => {
    axios.get(getPath(path), {
        params: obj,
        paramsSerializer: params => {
            return  Object.keys(params)
                .map( (key: any) => new URLSearchParams(`${key}=${params[key]}`) )
                .join("&")
        }
    }).then(res => callback(res.data));
}

export const put = (path: string, obj: object ): void => {
    axios.put(getPath(path), {
        params: obj
    })
}
