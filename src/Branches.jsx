import { useState } from "react"
import useFetching from "./hooks/fetching"

export default function Branches(props){
    const [fetching,data,isError] = useFetching(props.endpoint.split('{')[0])
    const [showBranchNumber,setShowBranchNumber] = useState(9)

    if(fetching) return <>Loading..</>
    else if(!data || isError) return <>SomeThing Went Wrong Please Try Again</>
    else return (
        <div className="relative bottom-0 ">
            <div>Total Branches: {data.length}</div>
            <ul className="list-decimal ml-4 md:columns-2">
                <li>{props.default} <span className="py-0.5 px-1.5 rounded-md bg-stone-200">Default Branch</span></li>
                {data.slice(0,showBranchNumber).map(branch=>{
                        if(branch.name===props.default) return ''
                        return <li key={branch.name}>{branch.name}</li>
                    })}
                {data.length>9
                    ?<li className="list-none flex gap-5">
                        {showBranchNumber<data.length
                            ?<div onClick={()=>setShowBranchNumber(()=>{
                                if(showBranchNumber+10>data.length) return data.length
                                return showBranchNumber+10
                            })}
                                className="hover:text-purple-600 cursor-pointer w-min font-semibold" >More...</div>
                            :''
                        }
                        {showBranchNumber===data.length
                            ?<div onClick={()=>setShowBranchNumber(9)}
                            className="hover:text-purple-600 cursor-pointer w-min font-semibold" >Collapse all</div>
                            :''
                        }
                        {showBranchNumber>9
                            ?<div onClick={()=>setShowBranchNumber(()=>{
                                if(showBranchNumber-10<9) return 9
                                return showBranchNumber-10
                            })}
                                className="hover:text-purple-600 cursor-pointer w-fit font-semibold" >
                                Show Less</div>
                            :''}
                    </li>:''}
            </ul>
        </div>
    )
}