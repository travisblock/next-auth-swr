import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import fetcher from "lib/fetcher";
import endpoint from "config/endpoint";

export default withIronSessionApiRoute(taskStore, sessionOptions)
async function taskStore(req, res) {
    try {
        const { id } = req.query;
        const { token } = req.session;
        const { name, description } = req.body;

        if (!token) {
            req.session.destroy();
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { task : data } = await fetcher(endpoint('user.task.store'), {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description })
        })
        res.status(200).send(data);

    }catch(err) {
        res.status(400).json({ error: err.message })
    }
}