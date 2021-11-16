import UserLayout from "components/layouts/user"
import { route } from "config/routes"
import useSWR from "swr"
import api from "config/api"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { useTable } from "react-table"
import { SingleSkeleton } from "components/globals/skeletons"
import tableStyle from 'styles/table.module.css'
import Link from "next/link"
import { withIronSessionSsr } from "iron-session/next"
import { sessionOptions } from "lib/session"
import confirmAlert, { closeAlert } from "components/globals/ConfirmAlert"
import fetcher from "lib/fetcher"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

function handleDelete(e, id, mutate) {
    e.preventDefault();
    confirmAlert({
        title: 'Hapus Tugas!',
        message: 'Apakah anda yakin ingin menghapus tugas ini?',
        buttons: [
            {
                label: 'Hapus',
                key: 'ok',
                onClick: async () => {
                    console.log('delete', id)
                    try {
                        const res = await fetcher(api('user.task.delete', {id: id}), {
                            method: 'DELETE'
                        });
                        toast.success('Berhasil hapus tugas', {
                            theme: 'colored'
                        })
                        mutate()
                    } catch (error) {
                        console.log(error)
                        toast.error('Gagal hapus tugas', {
                            theme: 'colored'
                        })
                    }
                }
            },
            {
                label: 'Batal',
                key: 'cancel',
                onClick: () => {
                    console.log('cancel')
                }
            }
        ]
    })
}

function Table ({ columns, data, loading, from, mutate }) {
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
                                return (
                                    <td key={i} className={`${tableStyle.td} ${tableStyle.tdaction}`} {...cell.getCellProps()}>
                                        {(cell.column.id === "id") && !loading && (
                                            <div>
                                                <Link href={route('user.task.edit', {id: cell.value})} shallow={true}>
                                                    <a className={tableStyle.edit} href={route('user.task.edit', {id: cell.value})}>EDIT</a>
                                                </Link>
                                                <a className={tableStyle.delete} href="#" onClick={(e) => handleDelete(e, cell.value, mutate)}>HAPUS</a>
                                            </div>
                                        )}
                                        {(cell.column.id === "row") && !loading && (
                                            <>{ Number(cell.row.id) + Number(from)}</>
                                        )}
                                        { (cell.column.id !== "id" || loading) && cell.render('Cell') }
                                    </td>
                                )
                        })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default function Task() {
    const [pageIndex, setPageIndex] = useState(1)
    const { data, error, mutate } = useSWR(`${api('user.task.index')}?page=${pageIndex}`)
    const router = useRouter()
    const next = router.asPath ? `/?next=${router.asPath}` : ''
    const loading = (!error && !data) || (error && !data)
    
    if (error && !data) {
        router.replace(`${route('login')}${next}`)
    }

    useEffect(() => {
        router.events.on('routeChangeStart', () => closeAlert());
        return () => {
            router.events.off('routeChangeStart', () => closeAlert());
        }
    }, [router])

    const tasks = useMemo(() => (loading ? Array(5).fill({}) : data.data), [data, loading])

    const rawColumns = [
        {
            Header: 'No',
            id: 'row',
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

    function handlePageChange(page) {
        if (page) {
            setPageIndex(page)
        }
    }

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
                <Table columns={columns} data={tasks} from={data?.from ?? 0} loading={loading} mutate={mutate} />
                <ul className={tableStyle.pagination}>
                    { data?.links ? data.links.map((link, i) => (
                        <li className={tableStyle.paginationItem} key={i}>
                            <button onClick={() => handlePageChange(link.page)} disabled={!link.url} className={link.active ? tableStyle.active : null}>{link.label}</button>
                        </li>
                    )) : null }
                </ul>
                <ToastContainer/>
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