/* eslint-disable react/prop-types */
import useFetching from "./hooks/fetching"

export default function Owner({data}){
    const [fetching,resData,error] = useFetching(data.url)
    return (
    <>
        <h2>Name: {data.login}</h2> <div>UserID: {data.id}</div>
        <h3>URL: {data.html_url}</h3>
        {fetching?<div>Fetching More Data...</div>
            :error?<div>Something went wrong</div>
                :resData
                    ?<div>
                        <div>Public Repositories: {resData.public_repos}</div>
                        <div>Public Gists: {resData.public_gists}</div>
                        <div>Joined GitHub: {resData.created_at}</div>
                        <div>Bio: {resData.bio}</div>
                    </div>
                    :''
        }

    </>)
}

// Owner.propTypes = {
//     data:PropTypes.object.isRequired
// }