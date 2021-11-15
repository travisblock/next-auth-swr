import UserLayout from "components/layouts/user";
import api from "config/api";
import { route } from "config/routes";
import useSWR from "swr";
import formStyle from "styles/form.module.css";
import { SingleSkeleton } from "components/globals/skeletons";
import fetcher from "lib/fetcher";
import { useState } from "react";
import { useClientRouter } from "use-client-router";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";

export default function TaskEdit() {
    const router = useClientRouter()
    const { id } = router.query
    const { data, error, mutate } = useSWR(api('user.task.edit', { id: id }))
    const loading = (!error && !data) || ( error && !data )
    const [submitted, setSubmitted] = useState(false)

    if (error && !data) {
        router.replace(`${route('login')}/?next=${route('user.task.index')}`)
    }

    async function handleFormSubmit(e) {
        e.preventDefault()
        setSubmitted('Proses...')
        const formData = new FormData(e.target)
        const data = {
            id: id,
            name: formData.get('name'),
            description: formData.get('description'),
        }

        try {
            const updated = await fetcher(api('user.task.update', { id: id }), {
                method: 'PATCH',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            setSubmitted('Sukses...')
            if (updated) {
                mutate()
                router.push(`${route('user.task.index')}`, { shallow: true })
            }
        }catch (err) {
            setSubmitted(false)
        }
    }
    
    return (
        <UserLayout title="Edit Tugas">
            <div className="content">
                <h1 style={{ textAlign: 'center' }}>Edit { data?.name } </h1>
            </div>
            <div className="content">
                <form onSubmit={handleFormSubmit} className={formStyle.form}>
                    { data &&  (   
                        <div className={formStyle.group}>
                            <label htmlFor="name">Nama Tugas</label>
                            <input type="text" name="name" className={formStyle.control} defaultValue={data?.name} />
                        </div>
                    )}
                    { data &&  (
                        <div className={formStyle.group}>
                            <label htmlFor="description">Deskripsi</label>
                            <textarea name="description" className={formStyle.control} defaultValue={data?.description} />
                        </div>
                    )}
                    { loading && (
                        <>
                        <SingleSkeleton/>
                        <br/><br/>
                        <SingleSkeleton/>
                        </>
                    )}
                    <div className={formStyle.group}>
                        <button type="submit" className={formStyle.button} disabled={submitted ? true : false}>
                            { submitted ? submitted : 'Simpan' }
                        </button>
                    </div>
                </form>
            </div>
        </UserLayout>
    )
}


export const getServerSideProps = withIronSessionSsr(async function (ctx) {
    const { req, resolvedUrl } = ctx
    const { user } = req.session

    const nexturi = resolvedUrl ? `${route('login')}?next=${resolvedUrl}` : route('login')
    if (!user) {
        return {
            redirect : {
                destination: nexturi,
                permanent: false
            }
        }
    }
    return {
        props : {}
    }
}, sessionOptions)