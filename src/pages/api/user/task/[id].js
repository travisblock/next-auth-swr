import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import endpoint from "config/endpoint";
import fetcher from 'lib/fetcher';

export default withIronSessionApiRoute(taskDetail, sessionOptions);
function taskDetail (req, res) {
    switch (req.method) {
        case 'GET':
            return taskGet(req, res);
        case 'PATCH':
            return taskUpdate(req, res);
        case 'DELETE':
            return taskDelete(req, res);
        default:
            return res.status(405).json({ error: 'Method Not Allowed' });
    }
}

async function taskGet(req, res) {
    try {
        const { id } = req.query;
        const { token } = req.session;

        if (!token) {
            req.session.destroy();
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        
        const { task : data } = await fetcher(endpoint('user.task.edit', { id }), {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        })

        res.status(200).send(data);

    } catch(err) {
        res.status(400).json({ error: err.message })
    }
}

async function taskUpdate(req, res) {
    try {
        const { id } = req.query;
        const { token } = req.session;
        const { name, description } = req.body;

        if (!token) {
            req.session.destroy();
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { task : data } = await fetcher(endpoint('user.task.update', { id }), {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, '_method': 'PATCH' })
        })
        res.status(200).send(data);

    }catch(err) {
        res.status(400).json({ error: err.message })
    }

}

function taskDelete(req, res) {

}