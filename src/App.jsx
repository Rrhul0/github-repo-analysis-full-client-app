import { useRef, useState } from 'react'
import Header from './Header'
import './App.css'
import ShowRepos from './ShowRepos'
import Branches from './Branches'
import Languages from './Languages'

function App() {
    const [repos,setRepos] = useState([])
    const [isFetchingRepos,setIsFetchingRepos] = useState(null)
    const [selectedRepoName,setSelectedRepoName] = useState('')
    const refErrorUsername = useRef()

    async function onUsernameEntered(e){
        const username = e.target.value
        refErrorUsername.current.textContent = 'Please Enter Username'
        setRepos([])
        if(!username) return
        try{
            setIsFetchingRepos(true)
            const res = await fetch(`https://api.github.com/users/${username}/repos`)
            if(res.status !==200) {
                refErrorUsername.current.textContent = 'Invalid Username! Try again'
                return
            }
            setRepos(await res.json())
            setIsFetchingRepos(false)
        }
        catch{
            console.log('failed to fetch the github api endpoint')
        }
    }

    const selectedRepo = repos.find(repo=>repo.name===selectedRepoName)
    return (
        <>
            {/* <Header/> */}
            <div ref={refErrorUsername}>Please Enter Username: </div>
            <input className='searchRepoInput' type='text' placeholder='GitHub Username' onBlur={onUsernameEntered}/>
            <div>
                {!isFetchingRepos
                    ?isFetchingRepos===null
                        ?''
                        :<ShowRepos repos={repos.map(repo=>repo.name)} selectRepo={setSelectedRepoName}/>
                    :'Loading Repositories'
                }
            </div>
            {selectedRepo
                ?<div>
                    <h3>--About Repository--</h3>
                    <div>Name: {selectedRepo.name} </div>
                    <div>Owner: {selectedRepo.owner.login}</div>
                    <div>Repo ID: {selectedRepo.id}</div>
                    <div>{selectedRepo.private?'Private':'Public'} Repository</div>
                    <div>Description: {selectedRepo.description}</div>
                    <div>Language Used: {selectedRepo.language}</div>
                    <div>Size: {selectedRepo.size} KB</div>
                    <div>Forks Count: {selectedRepo.forks_count}</div>
                    <div>Watch Count: {selectedRepo.watchers_count}</div>
                    <h3>--Branches--</h3>
                    <Branches default={selectedRepo.default_branch} endpoint={selectedRepo.branches_url}/>
                    <h3>--Languages Used--</h3>
                    <Languages endpoint={selectedRepo.languages_url}/>
                    <h3>--Issues & Pull Requests--</h3>
                </div>
                :''
            }
        </>
    )
}

export default App
