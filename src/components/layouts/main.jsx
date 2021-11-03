import Head from 'next/head'

function Main({ ...props }) {
    return (
        <>
            <Head>
                <title>{ props.title }</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
                <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;800&display=swap" rel="stylesheet" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content="Next.js app by ajid2" />
                <meta name="author" content="https://github.com/ajid2" />
            </Head>
            { props.children }
        </>
    )
}

export default Main