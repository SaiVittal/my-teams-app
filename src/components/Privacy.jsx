// import { useContext } from "react";
// import { TeamsFxContext } from "./Context";
// import React from "react";
// import { applyTheme } from "@microsoft/mgt-react";
// import { Button } from "@fluentui/react-components";

// export default function Tab() {
//   const { themeString } = useContext(TeamsFxContext);

//   React.useEffect(() => {
//     applyTheme(themeString === "default" ? "light" : "dark");
//   }, [themeString]);

//   return (
//     <div>
//       {consentNeeded && (
//         <>
//           <p>
//             Click below to authorize button to grant permission to using
//             Microsoft Graph.
//           </p>
//           <Button appearance="primary">Authorize</Button>
//         </>
//       )}

//       {!consentNeeded && <></>}
//     </div>
//   );
// }
