import UserLayout from "components/layouts/user";
import api from "config/api";
import { route } from "config/routes";
import { useRouter } from "next/router";
import useSWR from "swr";
import formStyle from "styles/form.module.css";
import { SingleSkeleton } from "components/globals/skeletons";
import fetcher from "lib/fetcher";
import { useState } from "react";

export default function TaskEdit() {
    const router = useRouter()
    const { id } = router.query
    const { data, error, mutate } = useSWR(api('user.task.edit', { id: id }))
    const loading = (!error && !data) || ( error && !data )
    const [submitted, setSubmitted] = useState(false)

    if (error && !data) {
        router.replace(`${route('login')}/?next=${route('user.task.index')}`)
    }

    async function handleFormSubmit(e) {
        e.preventDefault()
        setSubmitted('Processing...')
        const formData = new FormData(e.target)
        const data = {
            id: id,
            name: formData.get('name'),
            description: formData.get('description'),
        }

        try {
            const { data: update } = await fetcher(api('user.task.update', { id: id }), {
                method: 'PATCH',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            setSubmitted('Success...')
            mutate()
            setTimeout(() => {
                setSubmitted(false)
            }, 2000)
        }catch (err) {
            setSubmitted(false)
        }
    }
    
    return (
        <>
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
                            { submitted ? submitted : 'Submit' }
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

TaskEdit.getLayout = (page) => (
    <UserLayout title="Edit Tugas">
        { page }
    </UserLayout>
)