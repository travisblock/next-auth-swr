import UserLayout from "components/layouts/user";
import api from "config/api";
import { route } from "config/routes";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function TaskEdit() {
    const router = useRouter()
    const { id } = router.query
    const { data, error } = useSWR(api('user.task.edit', { id: id }))
    const loading = (!error && !data) || ( error && !data )

    if (error && !data) {
        router.push(`${route('login')}/?next=${route('user.task.index')}`)
    }
    
    return (
        <>
            <div className="content">
                <h1 style={{ textAlign: 'center' }}>Edit { data?.name } </h1>
            </div>
        </>
    )
}

TaskEdit.getLayout = (page) => (
    <UserLayout title="Edit Tugas">
        { page }
    </UserLayout>
)