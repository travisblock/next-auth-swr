import endpoint from "config/endpoint";
import fetcher from "lib/fetcher";
import withSession from "lib/session";

export default withSession(async (req, res) => {
    const { token } = req.session.get();

    try {
        await fetcher(endpoint('logout'), {
            headers : {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        });
    }catch(error) {
        console.log('ERRRO ', error);
    }

    req.session.destroy()
    res.json({ user: null })
})