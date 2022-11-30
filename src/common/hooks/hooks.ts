// import { useState } from 'react'
//
// import { db } from 'firebaseInit'
//
// // export function useFirebaseTable() {
// //   const [data, setData] = useState(null)
// //   const [loading, setLoading] = useState<boolean>(false)
// //   const [error, setError] = useState<string | null>(null)
// //
// //   function resetRequestResponse() {
// //     setData(null)
// //     setError(null)
// //   }
// //
// //   async function createRequest() {
// //     setLoading(true)
// //     try {
// //       const collectionRef = db.collection(table)
// //       await collectionRef.onSnapshot((docSnapshot) => {
// //         setData(docSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
// //       })
// //     } catch (err) {
// //       setError(err?.response.data.message)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }
// //
// //   return {
// //     data,
// //     error,
// //     loading,
// //     createRequest,
// //     resetRequestResponse,
// //   }
// // }
