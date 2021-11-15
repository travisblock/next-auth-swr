import UserLayout from "components/layouts/user";
import { route } from "config/routes";
import useSWR from "swr";
import api from "config/api";
import Router from "next/router";
import { useEffect } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";

export default function User() {
    const { data: user, error } = useSWR(api('verify'));
    
    useEffect(() => {
        if (error && !user) {
            Router.replace(route('login'));
        }
    }, [error, user]);

    return (
        <UserLayout title="Welcome To Dashboard">
            <div className="content">
                <h1>Welcome</h1>
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