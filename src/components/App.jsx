// https://fluentsite.z22.web.core.windows.net/quick-start
import { TeamsUserCredential } from "@microsoft/teamsfx";
import { useState, useEffect } from "react";
import config from "./sample/lib/config";
import PlannerTasksTable from "./ProjectTasks";
import { useGraphWithCredential } from "@microsoft/teamsfx-react";


/**
 * The main app which handles the initialization and routing
 * of the app.
 */
const App =() => {
  // const [data, setTasks] = useState([]);

  //       const tasksData = useGraphWithCredential(
  //         async (graph, teamsUserCredential, scope) => {
  //           const tasksData = await graph.api("/me/Planner/Tasks").get();
  //           return tasksData;
  //         },
  //         { scope: ["Tasks.Read.All"] }
  //       );
  //       console.log(tasksData.data);
  //       setTasks(tasksData.value);
  //       const credential = new TeamsUserCredential(config);
  //       const accessToken = await credential.getToken(""); // Get SSO token
  //       const data = await credential.getUserInfo();
  //       setUserData(data);
      

  return (

    <PlannerTasksTable />


    //  <div className="section-margin">
    // <table>
    //     <thead>
    //       <tr>
    //         <th>Task Title</th>
    //         <th>Due Date</th>
           
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {data.map((task) => (
    //         <tr key={task.id}>
    //           <td>{task.title}</td>
    //           <td>{task.dueDateTime ? new Date(task.dueDateTime).toLocaleDateString() : 'N/A'}</td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    //   </div> 
    // <div>
    //   <h1>User Details</h1>
    //   {userData ? (
    //     <div>
    //       <b><p>Display Name: {userData.displayName}</p></b>
    //       <p>Email ID: {userData.preferredUserName}</p>
    //     </div>
    //   ) : (
    //     <p>Loading user data...</p>
    //   )}
    // </div>
  );
};

export default App;
