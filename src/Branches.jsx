import {useRef} from "react"
import useFetching from "./hooks/fetching"


export default function Branches(props){
    const [fetching,data,isError] = useFetching(props.endpoint.split('{')[0])
    const refBranchesList = useRef()

    function toggleListDisplay(e){
        refBranchesList.current.style.display = refBranchesList.current.style.display==='none'
            ? 'block'
            : 'none'
        e.target.textContent = refBranchesList.current.style.display==='none'
            ? 'Show List of Branches'
            : 'Hide List of Branches'
    }

    if(fetching) return <>Loading..</>
    else if(!data || isError) return <>SomeThing Went Wrong Please Try Again</>
    else return (
        <>
            <div>Default Branch: {props.default}</div>
            <div>Total Branches: {data.length}</div>
            <div onClick={toggleListDisplay}>Show All Branches</div>
            <ul ref={refBranchesList} style={{display:'none'}}>
                <li>{props.default} <span>Default</span></li>
                {data.map(branch=>{
                    if(branch.name===props.default) return ''
                    return <li key={branch.name}>{branch.name}</li>
                })}
            </ul>
        </>
    )
}