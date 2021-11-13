import UserLayout from "components/layouts/user"

export default function TaskCreate() {
    return (
        <>
        <div className="content">
            <h1>Submit Tugas</h1>
        </div>
        <div className="content">
        </div>
        </>
    )
}

TaskCreate.getLayout = (page) => (
    <UserLayout title="Submit Tugas">
        {page}
    </UserLayout>
)