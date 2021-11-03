import { get } from "lodash"

const API = {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    VERIFY: '/api/auth/verify'
}

export default function api (name) {
    return get(API, name.toUpperCase())
}