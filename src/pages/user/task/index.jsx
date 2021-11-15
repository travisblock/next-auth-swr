import UserLayout from "components/layouts/user"
import { route } from "config/routes"
import useSWR from "swr"
import api from "config/api"
import { useRouter } from "next/router"
import { useMemo } from "react"
import { useTable } from "react-table"
import { SingleSkeleton } from "components/globals/skeletons"
import tableStyle from 'styles/table.module.css'
import Link from "next/link"
import { withIronSessionSsr } from "iron-session/next"
import { sessionOptions } from "lib/session"

function Table ({ columns, data, loading}) {
    const { 
        getTableProps, 
        getTableBodyProps, 
        headerGroups, 
        rows, 
        prepareRow
    } = useTable({ columns, data })

    return (
        <table className={tableStyle.table} {...getTableProps()}>
            <thead>
                {headerGroups.map((headerGroup, i) => (
                    <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column, i) => (
                            <th key={i} className={tableStyle.th} {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr key={i} {...row.getRowProps()}>
                        {row.cells.map((cell, i) => {
                            if ((cell.column.id === "id") && !loading ) {
                                return (
                                    <td key={i} className={`${tableStyle.td} ${tableStyle.tdaction}`} {...cell.getCellProps()}>
                                        <div>
                                            <Link href={route('user.task.edit', {id: cell.value})} shallow={true}>
                                                <a className={tableStyle.edit} href={route('user.task.edit', {id: cell.value})}>EDIT</a>
                                            </Link>
                                            <a className={tableStyle.delete} href={`/delete/${cell.value}`}>HAPUS</a>
                                        </div>
                                    </td>
                                )
                            }
                            return <td key={i} className={tableStyle.td} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default function Task() {
    const { data, error} = useSWR(api('user.task.index'))
    const router = useRouter()
    const next = router.asPath ? `/?next=${router.asPath}` : ''
    const loading = (!error && !data) || (error && !data)
    
    if (error && !data) {
        router.replace(`${route('login')}${next}`)
    }

    const tasks = useMemo(() => (loading ? Array(2).fill({}) : data), [data, loading])

    const rawColumns = [
        {
            Header: 'No',
            id: 'row',
            Cell: ({ row }) => row.index + 1,
            width: 5
        },
        {
            Header: 'Judul',
            accessor: 'name',
            width: 35
            
        },
        {
            Header: 'Deskripsi',
            accessor: 'description',
            width: 50
        },
        {
            Header: 'Aksi',
            accessor: 'id',
            width: 10
        },
    ]

    const columns = useMemo(
        () => loading
        ? rawColumns.map(col => ({
            ...col,
            Cell: () => <SingleSkeleton/>
        }))
        : rawColumns , [data, loading, rawColumns]
    )

    return (
        <UserLayout title="Daftar Tugas Saya">
            <div className="content">
                <h1 style={{ textAlign: 'center' }}>Tugas Saya</h1>
            </div>
            <div className="content" style={{ overflowX: 'auto' }}>
                <div className={tableStyle.add}>
                    <Link href={route('user.task.create')} shallow={true}>
                        <a className={tableStyle.add}>+ Tambah Tugas</a>
                    </Link>
                </div>
                <Table columns={columns} data={tasks} loading={loading} />
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