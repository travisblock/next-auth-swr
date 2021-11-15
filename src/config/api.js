import { get } from "lodash"

const API = {
    LOGIN: 'api/auth/login',
    LOGOUT: 'api/auth/logout',
    VERIFY: 'api/auth/verify',
    USER: {
        TASK: {
            INDEX: 'api/user/task',
            STORE: 'api/user/task/store', // POST
            EDIT: 'api/user/task/{id}', // GET
            UPDATE: 'api/user/task/{id}', // PATCH
            DELETE: 'api/user/task/{id}', // DELETE
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