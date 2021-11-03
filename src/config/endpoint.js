import { get } from "lodash"

const ENDPOINT = {
    BASE: {
        LOCAL: 'https://api-multi-auth.herokuapp.com/api',
        PRODUCTION: 'https://api-multi-auth.herokuapp.com/api',
    },
    LOGIN: 'auth/authenticate',
    LOGOUT: 'auth/logout',
    VERIFY: 'auth/verify',
    ADMIN: {
        DASHBOARD: 'admin'
    },
    MANAGER: {
        DASHBOARD: 'manager'
    }
}

export default function endpoint (name) {
    const BASE = ENDPOINT.BASE[process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'LOCAL'];
    return `${BASE}/${get(ENDPOINT, name.toUpperCase())}`;
}