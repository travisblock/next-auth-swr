import Main from "components/layouts/main"
import api from "config/api"
import fetcher from "lib/fetcher"
import withSession from "lib/session"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import style from 'styles/login.module.css'

export default function Login() {
    const [errors, setErrors] = useState([])
    const router = useRouter()
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        const { email, password } = e.currentTarget
        
        try {
            const user = await fetcher(api('login'), {
                method: 'POST',
                headers: { 
                    'Content-Type' : 'application/json',
                    'Accept' : 'application/json'
                },
                body: JSON.stringify({ email : email.value, password : password.value})
            })
            if (user)  router.push('/profile')
        } catch (error) {
            setErrors(errors => [...errors, 'Gagal login, silahkan coba lagi'])
        }
    }, [])

    const handleClose = () => {
        setErrors([])
    }

    useEffect(() => {
        router.prefetch('/profile')
    }, [])

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
                        <button type="submit" className={style.submit}>Login</button>
                    </form>
                </div>
            </section>
        </Main>
    )
}

export const getServerSideProps = withSession(async function ({ req, res}) {
    const user = req.session.get('user')

    if (user) {
        return {
            redirect : {
                destination: '/profile',
                permanent: false
            }
        }
    }

    return {
        props : {}
    }
})