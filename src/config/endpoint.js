import { get } from "lodash"

const ENDPOINT = {
    BASE: {
        LOCAL: 'https://api-multi-auth.herokuapp.com/api',
        PRODUCTION: 'https://api-multi-auth.herokuapp.com/api',
    },
    LOGIN: 'auth/authenticate',
    LOGOUT: 'auth/logout',
    VERIFY: 'auth/verify',
    USER: {
        TASK: {
            INDEX: 'user/task', // GET
            STORE: 'user/task', // POST
            EDIT: 'user/task/{id}/edit', // GET
            UPDATE: 'user/task/{id}', // PATCH
            DELETE: 'user/task/{id}', // DELETE
        }
    }
}

export default function endpoint (name, param=null) {
    const BASE = ENDPOINT.BASE[process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'LOCAL'];
    name = `${BASE}/${get(ENDPOINT, name.toUpperCase())}`;
    return !param ? name : replacer(name, param);
}

function replacer (resource, data) {
    return resource.replace(/\{(.*?)\}/g, ($1, $2) => data[$2]);
}