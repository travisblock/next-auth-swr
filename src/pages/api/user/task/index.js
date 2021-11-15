import api from "config/api";
import endpoint from "config/endpoint";
import { withIronSessionApiRoute } from "iron-session/next"
import fetcher from "lib/fetcher";
import { sessionOptions } from "lib/session"

export default withIronSessionApiRoute(taskIndex, sessionOptions);

async function taskIndex(req, res) {
    try{
        const token = req.session.token
        if (typeof token != 'undefined') {
            const { tasks : data } = await fetcher(endpoint('user.task.index'), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })

            data.links.map(link => {
                const page = link?.url?.split('?')[1];
                link.url = link.url ? `${api('user.task.index')}?${page}` : null;
            })

            res.json(data)
        } else {
            req.session.destroy()
            res.status(401).json({ user: null })
        }
    }catch(error) {
        req.session.destroy()
        res.status(500).json({ error: error.message })
    }
}