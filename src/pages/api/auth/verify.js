import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";

export default withIronSessionApiRoute(verify, sessionOptions)

async function verify (req, res) {
    try{
        const user = req.session.user
    
        if (user) {
            res.json({ ...user })
        }else {
            req.session.destroy()
            res.status(401).json({ user: null })
        }
    }catch(error) {
        req.session.destroy()
        res.status(500).json({ error: error.message })
    }
}