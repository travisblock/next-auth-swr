import Head from 'next/head'

function Main({ ...props }) {
    return (
        <>
            <Head>
                <title>{ props.title }</title>
                <meta name="description" content={`${ props.desc || "Next.js app by ajid2" }`} />
            </Head>
            { props.children }
        </>
    )
}

export default Main