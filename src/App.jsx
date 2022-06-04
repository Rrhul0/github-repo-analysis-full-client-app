import { useState } from 'react'
import ShowRepos from './ShowRepos'
import Branches from './Branches'
import Languages from './Languages'
import Owner from './Owner'
import ShowIssues from './Issues'

function App() {
    const [selectedRepo,setSelectedRepo] = useState(null)

    return (
        <>
            <ShowRepos setSelectedRepo={setSelectedRepo}/>
            {selectedRepo
                ?<div className='border-4 m-4 rounded-xl border-yellow-300 sm:flex gap-4 p-4 py-2 '>
                    <div className='flex-1 '>
                        <fieldset className='fieldset'>
                            <legend className='legend'>Repository</legend>
                            <div>Name: {selectedRepo.name} </div>
                            <div>Owner: {selectedRepo.owner.login}</div>
                            <div>Repo ID: {selectedRepo.id}</div>
                            <div>{selectedRepo.private?'Private':'Public'} Repository</div>
                            <div>Description: {selectedRepo.description}</div>
                            <div>Size: {selectedRepo.size} KB</div>
                            <div>Forks Count: {selectedRepo.forks_count}</div>
                            <div>Watch Count: {selectedRepo.watchers_count}</div>
                        </fieldset>
                        <fieldset className='fieldset'>
                            <legend className='legend'>Owner</legend>
                            <Owner data={selectedRepo.owner}/>  
                        </fieldset>
                    </div>
                    <div className='flex-1'>
                        <fieldset className='fieldset'>
                            <legend className='legend'>Langauges</legend>
                            <Languages endpoint={selectedRepo.languages_url}/>  
                        </fieldset>
                        <fieldset className='fieldset'>
                            <legend className='legend'>Branches</legend>
                            <Branches default={selectedRepo.default_branch} endpoint={selectedRepo.branches_url}/>
                        </fieldset>
                        <fieldset className='fieldset'>
                            <legend className='legend'>Issues</legend>
                            <ShowIssues open_issues={selectedRepo.open_issues} endpoint={selectedRepo.issues_url}/>
                        </fieldset>
                    </div>
                    {/* <h3>--Languages Used--</h3>
                    <h3>--Issues & Pull Requests--</h3> */}
                    
                </div>
                :''
            }
        </>
    )
}

export default App
