import React, { useCallback, useState } from 'react'
import s from './Editor.module.css'
import SW from '../../utils/sw'

const sw = new SW()

function Editor () {
  const [messageText, setMessageText] = useState('')
  const [savedMessage, setSavedMessage] = useState(null)

  const onChangeMessage = useCallback((e) => {
    setMessageText(e.target.value)
  }, [])

  const onSaveMessage = useCallback((e) => {
    e.preventDefault()

    sw
      .sendMessage({
        type: 'SAVE_DATA',
        payload: {
          time: new Date(),
          text: messageText
        }
      })
      .subscribe(msg => {
        setSavedMessage(msg)
        setMessageText('')
      })
  }, [messageText])

  return (
    <div className={s.Editor}>
      <form onSubmit={onSaveMessage}>
        {savedMessage && (
          <div>
            Messages saved to DB:
            <hr/>
            <div className={s.EditorText}>
              id: <b>{savedMessage.id}</b><br/>
              time: <b>{savedMessage.time.toString()}</b><br/>
              text: <b>{savedMessage.text}</b>
            </div>
          </div>
        )}

        <input
          type="text"
          placeholder="Input your message..."
          value={messageText}
          onChange={onChangeMessage}
        />

        <button disabled={!messageText}>
          Send message
        </button>
      </form>
    </div>
  )
}

export default Editor
