import { useState } from 'react'

import { db } from 'firebaseInit'
import { UPDATE_ALERT_INFO } from 'store/alert-slice'

import { useAppDispatch } from 'common/hooks/redux'

export function useFirebaseTable(table: 'products' | 'categories') {
  const dispatch = useAppDispatch()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  function resetRequestResponse() {
    setData(null)
    setError(null)
  }

  async function createRequest() {
    try {
      setLoading(true)
      const collectionRef = db.collection(table)
      await collectionRef.onSnapshot((docSnapshot) => {
        setData(docSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        setLoading(false)
      })
    } catch (err) {
      setLoading(false)
      setError(err?.response.data.message)
      dispatch(
        UPDATE_ALERT_INFO({
          title: 'Fetching error',
          description: err.message,
        }),
      )
    }
  }

  return {
    data,
    error,
    loading,
    createRequest,
    resetRequestResponse,
  }
}
