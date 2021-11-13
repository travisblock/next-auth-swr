import { withIronSessionApiRoute } from "iron-session/next";
import endpoint from "config/endpoint";
import fetcher from "lib/fetcher";
import { sessionOptions } from "lib/session";

export default withIronSessionApiRoute(login, sessionOptions)

async function login (req, res) {
    const { email, password } = req.body

    try {
        const { token, user } = await fetcher(endpoint('login'), {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        req.session.user = user
        req.session.token = token
        await req.session.save()
        res.json(user)
    }catch (error) {
        const { response } = error;
        res.status(response?.status || 500).json(error.data)
    }
}