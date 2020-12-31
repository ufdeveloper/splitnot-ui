// /*
//  * Copyright (c) 2018, Okta, Inc. and/or its affiliates. All rights reserved.
//  * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
//  *
//  * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
//  * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  *
//  * See the License for the specific language governing permissions and limitations under the License.
//  */
//
// import { useOktaAuth } from '@okta/okta-react';
// import React, {useRef, useEffect} from 'react';
// import config from "./config";
//
// function TransactionsPoller () {
//   const { authState, oktaAuth } = useOktaAuth();
//
//     useInterval(() => {
//
//         if (authState.isAuthenticated) {
//             const accessToken = oktaAuth.getAccessToken();
//
//             // poll for new notifications
//             fetch(config.splitnot.transactionsPollUrl, {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//             })
//                 .then((response) => {
//                     if (!response.ok) {
//                         return Promise.reject();
//                     }
//                     return response.json();
//                 })
//                 .then((data) => {
//                     console.log("poll response = " + JSON.stringify(data));
//                     return data;
//                     // alert("you have new transactions");
//                 })
//                 .catch((err) => {
//
//                     /* eslint-disable no-console */
//                     console.error("failed to poll for new transactions, error=" + err);
//                 });
//         }
//     }, 10000); // TODO - increase interval to 30 mins or 1 hour
//
//   function useInterval(callback, delay) {
//       const savedCallBack = useRef();
//       useEffect(() => {
//           savedCallBack.current = callback;
//       }, [callback]);
//
//       useEffect(() => {
//         function tick() {
//             savedCallBack.current();
//         }
//         if (delay !== null) {
//             const id = setInterval(tick, delay);
//             return () => {
//                 clearInterval(id);
//             }
//         }
//       }, [callback, delay]);
//     }
// };
//
//
// export default TransactionsPoller;
