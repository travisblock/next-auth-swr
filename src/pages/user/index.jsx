import Spinner from "components/globals/spinner";
import UserLayout from "components/layouts/user";
import { route } from "config/routes";
import useSWR from "swr";
import api from "config/api";
import Router from "next/router";
import { useEffect, useState } from "react";

export default function User() {
    const { data: user, error } = useSWR(api('verify'));
    
    if (error && !user) {
        Router.replace(route('login'));
    }

    if (!user) {
        return <Spinner/>
    }

    return (
        <UserLayout title="Welcome To Dashboard">
            <div className="content">
                <h1>Welcome</h1>
            </div>
        </UserLayout>
    )
}