import { useState, useLayoutEffect } from 'react'

export default function useFetching(endpoint) {
    const [fetching, setFetching] = useState(null)
    const [data, setData] = useState(null)
    const [isError, setError] = useState(null)

    useLayoutEffect(() => {
        setFetching(true)
        fetch(endpoint)
            .then(res => {
                if (res.status !== 200) setError(true)
                else return res.json()
                return
            })
            .then(json => {
                setFetching(false)
                setData(json)
            })
            .catch(() => setError(true))
    }, [endpoint])

    return [fetching, data, isError]
}
