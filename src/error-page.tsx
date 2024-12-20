import { useEffect } from "react"
import { useRouteError } from "react-router-dom"

export function ErrorPage() {
    const err = useRouteError()

    useEffect(() => console.log(err), [])

    return (
        <div>Error</div>
    )
}