import React, { useCallback, useState } from 'react'
import SW from '../../utils/sw'
import s from './Search.module.css'

const sw = new SW()

function Search () {
  const [messageId, setMessageId] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [foundMessage, setFoundMessage] = useState(null)

  const onInput = useCallback((e) => {
    setErrorMessage('')
    setMessageId(e.target.value.replace(/(\D+)+/, ''))
  }, [])

  const onSaveMessage = useCallback((e) => {
    e.preventDefault()
    setErrorMessage('')

    sw.sendMessage({
      type: 'FIND_MESSAGES',
      payload: { id: Number(messageId) }
    }).subscribe(msg => {
      if (!msg) {
        setErrorMessage(`item ${messageId} not found`)
      }

      setFoundMessage(msg || null)
      setMessageId('')
    })
  }, [messageId])

  return (
    <div className={s.Search}>
      <form onSubmit={onSaveMessage}>
        <div className={s.SearchResult}>
          {errorMessage}

          {foundMessage && (
            <>
              id: <b>{foundMessage.id}</b><br/>
              time: <b>{foundMessage.time.toString()}</b><br/>
              text: <b>{foundMessage.text}</b>
            </>
          )}
        </div>

        <input
          type="text"
          placeholder="Input message id..."
          value={messageId}
          onChange={onInput}
        />

        <button disabled={!messageId}>
          Send message
        </button>
      </form>
    </div>
  )
}

export default Search
