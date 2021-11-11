
export const get = (path: string, callback: (data: any) => void): void => {
    fetch(path)
        .then(res => res.json())
        .then(data => callback(data));
}

export const post = (path: string, obj: object, callback: (data: any) => void): void => {
    const CREDENTIALS = {
        method:'POST',
        body: JSON.stringify(obj),
        headers: new Headers()
    }
    fetch(path, CREDENTIALS)
        .then(res => res.json())
        .then(data => callback(data));
}