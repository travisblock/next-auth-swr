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
import fetcher from "lib/fetcher"

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
                                    <td key={i} className={tableStyle.td} {...cell.getCellProps()}>
                                        <Link href={route('user.task.edit', {id: cell.value})}>
                                            <a href={route('user.task.edit', {id: cell.value})}>EDIT</a>
                                        </Link>
                                        <a href={`/delete/${cell.value}`}>HPAUS</a>
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
            Cell: ({ row }) => row.index + 1
        },
        {
            Header: 'Judul',
            accessor: 'name',
            
        },
        {
            Header: 'Deskripsi',
            accessor: 'description',
        },
        {
            Header: 'Aksi',
            accessor: 'id',
        },
    ]

    const columns = useMemo(
        () => loading
        ? rawColumns.map(col => ({
            ...col,
            Cell: () => <SingleSkeleton/>
        }))
        : rawColumns , [data, loading]
    )

    return (
        <>
            <div className="content">
                <h1 style={{ textAlign: 'center' }}>Tugas Saya</h1>
            </div>
            <div className="content" style={{ overflowX: 'auto' }}>
                <Table columns={columns} data={tasks} loading={loading} />
            </div>
        </>
    )
}

Task.getLayout = (page) => (
    <UserLayout title="Daftar Tugas Saya">
        { page }
    </UserLayout>
)