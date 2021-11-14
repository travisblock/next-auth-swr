import Main from "components/layouts/main"
import api from "config/api"
import { route } from "config/routes"
import { withIronSessionSsr } from "iron-session/next"
import fetcher from "lib/fetcher"
import { sessionOptions } from "lib/session"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import style from 'styles/login.module.css'

export default function Login() {
    const [errors, setErrors] = useState([])
    const router = useRouter()
    const { next = route('user.index') } = router.query
    const [processing, setProcessing] = useState(false)

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        const { email, password } = e.currentTarget
        setProcessing(true)
        try {
            const user = await fetcher(api('login'), {
                method: 'POST',
                headers: { 
                    'Content-Type' : 'application/json',
                    'Accept' : 'application/json'
                },
                body: JSON.stringify({ email : email.value, password : password.value})
            })
            if (user) {
                router.push(next)
            } 
        } catch (error) {
            setErrors(errors => [...errors, 'Gagal login, silahkan coba lagi'])
        }
        setProcessing(false)
    }, [])

    const handleClose = () => {
        setErrors([])
    }

    useEffect(() => {
        router.prefetch(next)
    }, [next, router])

    return (
        <Main title="Masuk Untuk Melanjutkan">
            <section className={style.login}>
                <div className={`box-shadow ${style.box}`}>
                    <h1 className={style.title}>Sign In</h1>
                    {errors.map((err, idx) => (
                        <div key={idx} className={style.error}>
                            { err }
                            <span onClick={handleClose} className={style.close}>&times;</span>
                        </div>
                    ))}
                    <form className={style.form} onSubmit={handleSubmit}>
                        <div className={style.group}>
                            <label>Email</label>
                            <input type="email" name="email" className={style.input} autoComplete="off" required={true}/>
                        </div>
                        <div className={style.group}>
                            <label>Password</label>
                            <input type="text" name="password" className={style.input} autoComplete="off" required={true}/>
                        </div>
                        <button type="submit" className={style.submit}>
                            { processing ? 'Processing...' : 'Sign In' }
                        </button>
                    </form>
                </div>
            </section>
        </Main>
    )
}

export const getServerSideProps = withIronSessionSsr(async function ({ req }) {
    const { user } = req.session

    const nexturi = req.url 
    ? (
        decodeURIComponent(req.url).indexOf('next=') !== -1 
        ? decodeURIComponent(req.url).split('next=')[1] : route('user.index')
    )
    : route('user.index');
    
    if (user) {
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