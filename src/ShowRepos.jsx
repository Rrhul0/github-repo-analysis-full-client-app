import {useState } from "react"

export default function ShowRepos({repos,selectRepo}){
    const [filtered,setFiltered] = useState([])
    const [searchInput,setSearchInput] = useState('')
    const [highLightedIndex,setHighlightedIndex] = useState(null)

    function onTypingRepo(e){
        setSearchInput(e.target.value)
        if(!e.target.value) {
            setFiltered(repos.slice(0,12))
            return
        }
        const latters = searchInput.split('')
        setFiltered(repos.filter(repo=>{
            let isContainsAll = true
            latters.every(latter=>{
                if(!repo.includes(latter)){
                    isContainsAll = false
                    return false
                }
                return true
            })
            return isContainsAll
        }).slice(0,12))
    }
    
    function onKeyDown(e){
        const keyPressed = e.code
        if(keyPressed==='ArrowUp') setHighlightedIndex(()=>{
            if(highLightedIndex===null||highLightedIndex===0) return filtered.length - 1
            return highLightedIndex-1
        })
        else if(keyPressed==='ArrowDown') setHighlightedIndex(()=>{
            if(highLightedIndex===null||highLightedIndex===filtered.length-1) return 0
            return highLightedIndex+1
        })
        else if(keyPressed==='Enter') {
            selectRepo(filtered[highLightedIndex])
            setFiltered([])
            setSearchInput(filtered[highLightedIndex])

        }
    }
    function onMouseOver(e){
        setHighlightedIndex(filtered.indexOf(e.target.textContent))
    }

    return(
        <> 
            <h4>Found {repos.length} Repositories</h4>
            <div 
                onKeyDown={onKeyDown} 
                onMouseOver={onMouseOver} 
                onMouseDown={e=>{
                    if(!filtered.includes(e.target.textContent)) return
                    selectRepo(filtered[highLightedIndex])
                    setFiltered([])
                    setSearchInput(filtered[highLightedIndex])
                    }}
            >
                <input 
                    className="searchRepoInput"
                    type='text' 
                    placeholder='Select A Repository' 
                    value={searchInput} 
                    onChange={onTypingRepo} 
                    onFocus={e=>{
                        if(repos) setFiltered(repos.slice(0,12))
                        e.target.select()
                        }
                    }
                    onKeyDown={e=>{
                        if(e.key === 'KeyUp'|| e.key === 'KeyDown') return
                        if(e.key === 'Enter') e.target.blur()
                    }}
                    />
            
                {filtered.length!==0
                    ?
                    <div 
                        className="reposButtonsDiv"
                    >
                        {filtered.map((repoName,index)=>{
                            if(index===highLightedIndex) return (
                            <button 
                            key={repoName} 
                            className='selectRepoButton highlighted'
                            >
                                {repoName}
                            </button>)
                            return (
                                <button 
                                key={repoName} 
                                className='selectRepoButton'
                                >
                                    {repoName}
                                </button>)
                        })}
                        <div style={{display:filtered.length<repos.length?'block':'none'}}>{filtered.length<repos.length?repos.length-filtered.length:''} More Repositories</div>
                        <button onClick={()=>setFiltered([])}>Cancel!</button>
                    </div>
                    :''
                }
            </div>
        </>
    )
}