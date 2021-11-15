import UserLayout from "components/layouts/user"
import api from "config/api"
import fetcher from "lib/fetcher"
import { useRouter } from "next/router"
import { useState } from "react"
import formStyle from "styles/form.module.css"
import { route } from "config/routes"
import { sessionOptions } from "lib/session"
import { withIronSessionSsr } from "iron-session/next"

export default function TaskCreate() {
    const [submitted, setSubmitted] = useState(false)
    const router = useRouter()

    async function handleFormSubmit(event) {
        event.preventDefault()
        setSubmitted('Proses...')
        const formData = new FormData(event.target)
        const data = {
            name: formData.get('name'),
            description: formData.get('description'),
        }

        try {
            const created = await fetcher(api('user.task.store'), {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            setSubmitted('Sukses...')
            if (created) {
                setSubmitted(false)
                router.push(route('user.task.index'), { shallow: true })
            }
        } catch(err) {
            setSubmitted(false)
        }
    }

    return (
        <UserLayout title="Submit Tugas">
            <div className="content">
                <h1>Submit Tugas</h1>
            </div>
            <div className="content">
                <form onSubmit={handleFormSubmit} className={formStyle.form}>
                    <div className={formStyle.group}>
                        <label htmlFor="name">Nama Tugas</label>
                        <input type="text" name="name" className={formStyle.control} />
                    </div>
                    <div className={formStyle.group}>
                        <label htmlFor="description">Deskripsi</label>
                        <textarea name="description" className={formStyle.control} />
                    </div>
                    <div className={formStyle.group}>
                        <button type="submit" className={formStyle.button} disabled={submitted ? true : false}>
                            { submitted ? submitted : 'Submit' }
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