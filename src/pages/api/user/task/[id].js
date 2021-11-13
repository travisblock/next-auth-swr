import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import endpoint from "config/endpoint";
import fetcher from 'lib/fetcher';


export default withIronSessionApiRoute(TaskDetail, sessionOptions);
function TaskDetail (req, res) {
    switch (req.method) {
        case 'GET':
            return TaskGet(req, res);
        case 'PATCH':
            return TaskUpdate(req, res);
        case 'DELETE':
            return TaskDelete(req, res);
        default:
            return res.status(405).json({ error: 'Method Not Allowed' });
    }
}

async function TaskGet(req, res) {
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

function TaskUpdate(req, res) {

}

function TaskDelete(req, res) {

}