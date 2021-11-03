import api from "config/api";
import Router from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

export default function useUser({ 
    redirectTo = false,
    redirectIfFound = false
} = {}) {
    const { data: user, mutate } = useSWR(api('verify'))

    useEffect(() => {

        if (!redirectTo) return;

        if (
            (redirectTo && !redirectIfFound && !user ) ||
            (redirectIfFound && user)
        ) {
            Router.replace(redirectTo);
        }

    }, [user, redirectTo, redirectIfFound]);

    return { user, mutate };
}