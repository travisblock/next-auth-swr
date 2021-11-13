import Spinner from "components/globals/spinner";
import UserLayout from "components/layouts/user";
import { route } from "config/routes";
import useSWR from "swr";
import api from "config/api";
import Router from "next/router";
import { useEffect, useState } from "react";

export default function User() {
    const { data: user, error } = useSWR(api('verify'));

    if (!user && !error) {
        return <Spinner/>
    }

    if (error && !user) {
        Router.push(route('login'));
    }
    
    return (
        <div className="content">
            <h1>Welcome</h1>
        </div>
    )
}

User.getLayout = function getLayout(page) {
    return (
        <UserLayout title="Welcome To Dashboard">
            { page }
        </UserLayout>
    )
}