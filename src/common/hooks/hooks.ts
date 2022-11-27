import { useState } from 'react'

import { db } from 'firebaseInit'

export const useFirebaseTable = (table: 'categories' | 'products') => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const createRequest = async () => {
    try {
      setIsLoading(true)
      const collectionRef = db.collection(table)
      await collectionRef.onSnapshot((docSnapshot) => {
        setData(docSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }
  return {
    data,
    error,
    isLoading,
    createRequest,
  }
}
