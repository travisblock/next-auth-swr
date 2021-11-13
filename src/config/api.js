import { get } from "lodash"

const API = {
    LOGIN: 'api/auth/login',
    LOGOUT: 'api/auth/logout',
    VERIFY: 'api/auth/verify',
    USER: {
        TASK: {
            INDEX: 'api/user/task',
            CREATE: 'api/user/task/create',
            EDIT: 'api/user/task/{id}',
            DELETE: 'api/user/task/{delete}',
        }
    }
}

export default function api (name, param=null) {
    name = `/${get(API, name.toUpperCase())}`
    return !param ? name : replacer(name, param);
}

function replacer (resource, data) {
    return resource.replace(/\{(.*?)\}/g, ($1, $2) => data[$2]);
}