import { fromEvent, Observable } from 'rxjs'
import { map, filter } from 'rxjs/operators'

/**
 * @typedef {Object} Message
 * @property {String} type
 * @property {Object} payload
 */

class SW {
  _stream

  constructor (eventName = 'message') {
    if ('serviceWorker' in navigator) {
      this._stream = fromEvent(navigator.serviceWorker, eventName)
    } else {
      throw new Error('Service Worker is not supported')
    }
  }

  _generateMessageId = () => '_' + Math.random().toString(36).substr(2, 9)

  /**
   * @param {Message} message
   */
  sendMessage = (message) => {
    const msgId = this._generateMessageId()

    return new Observable((observer) => {
      this._stream
        .pipe(map(msg => msg.data))
        .pipe(filter(msg => msg.msgId === msgId))
        .subscribe(msg => {
          observer.next(msg.payload)
          observer.complete()
        })

      navigator.serviceWorker.controller.postMessage({
        msgId,
        ...message
      })
    })
  }
}

export default SW
