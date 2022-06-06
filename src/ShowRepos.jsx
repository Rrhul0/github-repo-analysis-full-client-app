import { useEffect, useState } from 'react'

export default function ShowRepos({ setSelectedRepo }) {
    const [filtered, setFiltered] = useState([])
    const [searchInput, setSearchInput] = useState('')
    const [highLightedIndex, setHighlightedIndex] = useState(null)
    const [findingRepos, setFindingRepos] = useState(null)
    const [repos, setRepos] = useState([])

    useEffect(() => {
        const handler = () => setFiltered([])
        window.addEventListener('click', handler)
        return () => window.removeEventListener('click', handler)
    }, [])

    async function onClickSearchUsername(e) {
        e.preventDefault()
        setFindingRepos(true)
        //reset the repo lists, filtered, selected repo,search input value else it will stick
        setRepos([])
        setFiltered([])
        setSelectedRepo(null)
        setSearchInput('')
        const username = new FormData(e.target).get('username')
        const userEndpoint = 'https://api.github.com/users/' + username
        try {
            const resUserEndpoint = await fetch(userEndpoint)
            if (resUserEndpoint.status !== 200) {
                setFindingRepos('error')
                return
            }
            const userData = await resUserEndpoint.json()
            const totalRepos = userData.public_repos
            const timeToFetchRepos = Math.ceil(totalRepos / 100)
            const endpointRepo = `https://api.github.com/users/${username}/repos?per_page=100`
            for (let i = 1; i <= timeToFetchRepos; i++) {
                const res = await fetch(endpointRepo + '&page=' + i)
                if (res.status !== 200) return
                const data = await res.json()
                setRepos(repos => repos.concat(data))
            }
            setFindingRepos(false)
        } catch {
            setFindingRepos('error')
            console.log('error occorred')
        }
    }

    function onTypingRepo(e) {
        setSearchInput(e.target.value)
        if (!e.target.value) {
            setFiltered(repos.slice(0, 12))
            return
        }
        const latters = searchInput.split('')
        setFiltered(
            repos
                .filter(repo => {
                    let isContainsAll = true
                    latters.every(latter => {
                        if (!repo.name.includes(latter)) {
                            isContainsAll = false
                            return false
                        }
                        return true
                    })
                    return isContainsAll
                })
                .slice(0, 12)
        )
    }

    function onKeyDown(e) {
        const keyPressed = e.code
        if (keyPressed === 'ArrowUp')
            setHighlightedIndex(() => {
                if (highLightedIndex === null || highLightedIndex === 0) return filtered.length - 1
                return highLightedIndex - 1
            })
        else if (keyPressed === 'ArrowDown')
            setHighlightedIndex(() => {
                if (highLightedIndex === null || highLightedIndex === filtered.length - 1) return 0
                return highLightedIndex + 1
            })
        else if (keyPressed === 'Enter') {
            setSelectedRepo(filtered[highLightedIndex])
            setFiltered([])
            setSearchInput(filtered[highLightedIndex].name)
        }
    }

    return (
        <div className="flex gap-6 m-3 border-4 border-blue-500 p-2 pt-1 rounded-xl">
            <div className="w-1/2">
                <h4>Type GitHub Username</h4>
                <form
                    className="flex rounded-lg border-2 border-gray-600 overflow-hidden focus-within:border-purple-600"
                    onSubmit={onClickSearchUsername}>
                    <input
                        className=" w-full h-10 p-2 text-xl font-medium focus-within:outline-none "
                        type="text"
                        placeholder="GitHub Username"
                        name="username"
                        autoComplete="off"
                    />{' '}
                    {/*className='searchRepoInput'  */}
                    <button
                        type="submit"
                        className="w-12 h-9 mr-0.5 rounded-lg self-center grid justify-center items-center hover:text-purple-600 hover:bg-stone-200">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 "
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </button>
                </form>
            </div>
            <div
                className="w-1/2 relative"
                onKeyDown={onKeyDown}
                onMouseOver={e => setHighlightedIndex(filtered.findIndex(repo => repo.name === e.target.textContent))}
                onMouseLeave={e => {
                    if (filtered.findIndex(repo => repo.name === e.target.textContent) === -1) return
                    setHighlightedIndex(null)
                }}
                onClick={e => {
                    //stop propogation to window as window click used to close menu
                    e.stopPropagation()

                    const clickedRepoIndex = filtered.findIndex(repo => repo.name === e.target.textContent)
                    //if clicked on something other then repo name then index of that will be -1
                    if (clickedRepoIndex === -1) return
                    setSelectedRepo(filtered[clickedRepoIndex])
                    setFiltered([])
                    setSearchInput(filtered[clickedRepoIndex].name)
                }}>
                <h4>
                    {findingRepos
                        ? findingRepos === 'error'
                            ? 'Something wrong please check username and try again'
                            : `Loading Repositories...(Found ${repos.length})`
                        : findingRepos === null
                        ? 'First Enter GitHub Username'
                        : `Found ${repos.length} Repositories`}
                </h4>
                <div className="rounded-lg border-2 border-gray-600 overflow-hidden focus-within:border-purple-600">
                    <input
                        className="w-full h-10 p-2 text-lg focus-visible:outline-none"
                        type="text"
                        placeholder="Search A Repository"
                        value={searchInput}
                        onChange={onTypingRepo}
                        onFocus={e => {
                            if (repos) setFiltered(repos.slice(0, 12))
                            e.target.select()
                        }}
                        onKeyDown={e => {
                            if (e.key === 'KeyUp' || e.key === 'KeyDown') return
                            if (e.key === 'Enter') e.target.blur()
                        }}
                    />
                </div>

                {filtered.length !== 0 ? (
                    <ul className="reposButtonsDiv absolute left-0 right-0 mt-2 z-50 rounded-xl overflow-hidden border-2 border-purple-400">
                        {filtered.map((repo, index) => {
                            return (
                                <li
                                    key={repo.name}
                                    className={
                                        (index === highLightedIndex ? ' bg-stone-200 text-blue-700 ' : '') +
                                        ' selectRepoButton text-center '
                                    }>
                                    {repo.name}
                                </li>
                            )
                        })}
                        <li className={(filtered.length < repos.length ? 'block' : 'hidden') + ' text-center'}>
                            {filtered.length < repos.length ? repos.length - filtered.length : ''} More Repositories
                        </li>
                    </ul>
                ) : (
                    ''
                )}
            </div>
        </div>
    )
}
