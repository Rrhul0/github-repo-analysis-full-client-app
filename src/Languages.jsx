import useFetching from "./hooks/fetching"

export default function Languages({endpoint}){
    const [isFetching,data,error] = useFetching(endpoint)
    if(isFetching) return <div>Fetching Languages...</div>
    else if(error||!data) return <div>Error Occorred Please Try Again </div>
    else {
        const allValues = Object.values(data)
        const total = allValues.reduce((pv,cv)=>{
            return pv+cv
        },0)
        return(
            <ol>
                {Object.keys(data).map(key=>(
                    <li key={key}>{key} - {((data[key]/total)*100).toFixed(2)}% </li>
                ))}
            </ol>
        )
    }
}