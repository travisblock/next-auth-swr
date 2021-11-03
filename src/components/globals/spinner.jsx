import style from './spinner.module.css'

export default function Spinner() {
    return (
        <div className={style.BoxLoader}>
            <div className={style.Loader}>
                <div className={style.LoaderSpinner}>
                    <div></div>
                    <div>
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    )
}