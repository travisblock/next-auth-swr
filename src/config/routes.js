import { get } from "lodash"

const ROUTES = {
    LOGIN: 'login',
    USER: {
        INDEX: 'user',
        TASK: {
            INDEX: 'user/task',
            CREATE: 'user/task/create',
            EDIT: 'user/task/{id}/edit'
        }
    }
}

export function route (name, binding=null) {
    name = get(ROUTES, name.toUpperCase())
    if (!binding) return `/${name}`;

    return `/${replacer(name, binding)}`
}

function replacer (resource, data) {
    return resource.replace(/\{(.*?)\}/g, ($1, $2) => data[$2]);
}
