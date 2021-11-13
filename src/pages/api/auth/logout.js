import { withIronSessionApiRoute } from "iron-session/next";
import endpoint from "config/endpoint";
import fetcher from "lib/fetcher";
import { sessionOptions } from "lib/session";

export default withIronSessionApiRoute(logout, sessionOptions)

async function logout (req, res) {
    const token = req.session.token

    try {
        await fetcher(endpoint('logout'), {
            headers : {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        });
    }catch(error) {
        console.log('api/logout error ', error);
    }

    req.session.destroy()
    res.json({ user: null })
}