import Spinner from "components/globals/spinner";
import api from "config/api";
import { route } from "config/routes";
import fetcher from "lib/fetcher";
import useUser from "lib/useUser"
import { useRouter } from "next/router";

export default function Profile() {
    const { user, mutate } = useUser({ redirectTo: '/login' })
    const router = useRouter();
    if (!user) {
        return <Spinner/>
    }

    async function handleClick(e) {
        e.preventDefault();
        mutate(
            await fetcher(api('logout'), { method: 'POST' }),
            false
        )
        router.replace(route('login'))
    }
    
    return (
        <div>
            <h1>HALO {user.name}</h1>
            <br/>
            <button onClick={handleClick}>Logout</button>
        </div>
    )
}