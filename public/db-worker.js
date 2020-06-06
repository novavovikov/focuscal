importScripts('https://cdn.jsdelivr.net/npm/dexie@3.0.1/dist/dexie.min.js')

const db = new Dexie('MyDB')

// Declare tables, IDs and indexes
db.version(1).stores({
  messages: '++id, time, text'
})

const EVENT_ACTIONS = {
  FIND_MESSAGES: findMessagesAction,
  SAVE_DATA: saveMessageAction
}

self.addEventListener('message', async ({ data, source }) => {
  const { msgId, type, payload } = data
  const action = EVENT_ACTIONS[type]

  if (!action) {
    throw new Error(`Unregistered event type ${type}`)
  }

  const response = await action(payload)
  source.postMessage({
    msgId,
    payload: response
  })
})

async function saveMessageAction (payload) {
  await db.messages.add(payload)
  return payload
}

async function findMessagesAction (msgId) {
  return db.messages.get(msgId)
}
