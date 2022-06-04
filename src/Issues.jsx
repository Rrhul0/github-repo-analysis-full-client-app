/* eslint-disable react/prop-types */
export default function ShowIssues(props) {
  return (
    <div>
      Open Issues:
      {props.open_issues}
    </div>
  );
}
