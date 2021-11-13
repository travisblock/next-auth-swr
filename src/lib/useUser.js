import api from "config/api";
import { useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";

export default function useUser({ 
    redirectTo = false,
    redirectIfFound = false
} = {}) {
    const { data: user, mutate, error } = useSWR(api('verify'))
    const router = useRouter()
    const next = router.asPath ? `/?next=${router.asPath}` : ''
    const loading = !error && !user;

    useEffect(() => {

        if (!redirectTo) return;

        if (
            (redirectTo && !redirectIfFound && !user ) ||
            (redirectIfFound && user)
        ) {
            router.replace(`${redirectTo}${next}`);
        }

    }, [user, redirectTo, redirectIfFound]);

    return { user, mutate, loading };
}