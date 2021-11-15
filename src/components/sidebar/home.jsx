import api from "config/api";
import fetcher from "lib/fetcher";
import style from "./home.module.css"
import { route } from "config/routes";
import Link from "next/link"
import { useState } from "react";
import { sessionOptions } from "lib/session";
import { useClientRouter } from "use-client-router";

export default function HomeSidebar({ collapsed } = {}) {
    const router = useClientRouter();
    const [islogout, setIslogout] = useState(false)

    console.log(router.pathname);

    async function logout(e) {
        e.preventDefault();
        setIslogout(true)
        try{
            await fetcher(api('logout'));
            document.cookie = `${sessionOptions.cookieName}=;max-age=0;expires=${new Date().toDateString()}`;
        }catch(e){
            console.log('logout action error ', e)
            setIslogout(false)
        }
        router.replace(route('login'));
    }

    const activeMenu = (path) => router.pathname.includes(path) ? style.active : '';

    return (
        <div className={`${style.sidebar} ${collapsed ? style.collapse : null}`}>
            <ul className={style.sidebar_ul}>
                <li className={style.sidebar_ul_li}>
                    <Link href={route('user.index')} shallow={true}>
                        <a className={`${style.sidebar_a} ${router.pathname == route('user.index') ? style.active : null}`}>
                            <span className={style.icon}>
                                <svg className={style.svg} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                            </span>
                            <span className={style.title}>Home</span>
                        </a>
                    </Link>
                </li>
                <li className={style.sidebar_ul_li}>
                    <Link href={route('user.task.index')} shallow={true}>
                        <a className={`${style.sidebar_a} ${activeMenu('task')}`}>
                            <span className={style.icon}>
                            <svg className={style.svg} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </span>
                            <span className={style.title}>Task</span>
                        </a>
                    </Link>
                </li>
                <li className={style.sidebar_ul_li}>
                    <a href="#" className={`${style.sidebar_a}`} onClick={logout}>
                        <span className={style.icon}>
                        <svg className={style.svg} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        </span>
                        <span className={style.title}>
                            { islogout ? 'Keluar...' : 'Keluar' }
                        </span>
                    </a>
                </li>
            </ul>
        </div>
    )
}