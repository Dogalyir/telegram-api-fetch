# Callback Queries Guide

This guide explains how to handle callback queries from inline keyboard buttons using `telegram-api-fetch`.

## What are Callback Queries?

Callback queries are events triggered when users press inline keyboard buttons. They allow interactive responses without requiring users to type.

## Basic Usage

### 1. Create Inline Keyboard

```typescript
import { TelegramBot } from 'telegram-api-fetch'

const bot = new TelegramBot({ botToken: 'YOUR_TOKEN' })

await bot.sendMessage({
  chat_id: chatId,
  text: 'Choose an option:',
  reply_markup: {
    inline_keyboard: [
      [
        { text: '👍 Like', callback_data: 'like' },
        { text: '👎 Dislike', callback_data: 'dislike' }
      ],
      [{ text: '💡 Info', callback_data: 'info' }]
    ]
  }
})
```

### 2. Handle Callback Queries

```typescript
import { UpdateSchema, type CallbackQuery } from 'telegram-api-fetch'

// In your webhook handler
app.post('/webhook', async (req, res) => {
  const update = UpdateSchema.parse(req.body)

  if (update.callback_query) {
    await handleCallback(update.callback_query)
  }

  res.sendStatus(200)
})

async function handleCallback(query: CallbackQuery) {
  const chatId = query.message?.chat.id
  if (!chatId || !query.data) return

  switch (query.data) {
    case 'like':
      await bot.sendMessage({
        chat_id: chatId,
        text: 'Thanks for the feedback! 👍'
      })
      break
    case 'dislike':
      await bot.sendMessage({
        chat_id: chatId,
        text: 'We\'ll try to improve! 👎'
      })
      break
    case 'info':
      await bot.sendMessage({
        chat_id: chatId,
        text: 'This is a Telegram bot built with telegram-api-fetch'
      })
      break
  }
}
```

## Common Patterns

### Pattern 1: Simple Actions

```typescript
callback_data: 'like'
callback_data: 'help'
callback_data: 'cancel'
```

### Pattern 2: Action + ID

```typescript
callback_data: 'vehicle_1'
callback_data: 'product_42'

// Parse:
const [action, id] = query.data.split('_')
```

### Pattern 3: Multi-parameter

```typescript
callback_data: 'edit_product_42_price'

// Parse:
const [action, type, id, field] = query.data.split('_')
```

## Examples

### Dynamic List Selection

```typescript
async function showVehicleList(chatId: number) {
  const vehicles = [
    { id: 1, name: 'Truck A' },
    { id: 2, name: 'Van B' }
  ]

  await bot.sendMessage({
    chat_id: chatId,
    text: '🚗 Select a vehicle:',
    reply_markup: {
      inline_keyboard: vehicles.map(v => [{
        text: v.name,
        callback_data: `vehicle_${v.id}`
      }])
    }
  })
}

// Handle selection
if (query.data.startsWith('vehicle_')) {
  const vehicleId = parseInt(query.data.split('_')[1])
  await bot.sendMessage({
    chat_id: chatId,
    text: `You selected vehicle ${vehicleId}`
  })
}
```

### Navigation Menu

```typescript
async function showMainMenu(chatId: number) {
  await bot.sendMessage({
    chat_id: chatId,
    text: 'Main Menu',
    reply_markup: {
      inline_keyboard: [
        [{ text: '🚗 Vehicles', callback_data: 'menu_vehicles' }],
        [{ text: '📊 Reports', callback_data: 'menu_reports' }],
        [{ text: '⚙️ Settings', callback_data: 'menu_settings' }]
      ]
    }
  })
}

// Router
async function handleCallback(query: CallbackQuery) {
  const chatId = query.message?.chat.id
  if (!chatId) return

  switch (query.data) {
    case 'menu_vehicles':
      await showVehicleList(chatId)
      break
    case 'menu_reports':
      await showReports(chatId)
      break
    // ...
  }
}
```

### Confirmation Dialog

```typescript
async function showDeleteConfirmation(chatId: number, itemId: number) {
  await bot.sendMessage({
    chat_id: chatId,
    text: '⚠️ Are you sure you want to delete this item?',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✅ Yes', callback_data: `delete_yes_${itemId}` },
          { text: '❌ No', callback_data: 'delete_no' }
        ]
      ]
    }
  })
}
```

## Best Practices

### Always Validate

```typescript
async function handleCallback(query: CallbackQuery) {
  if (!query.data) {
    console.error('Callback without data')
    return
  }

  const chatId = query.message?.chat.id
  if (!chatId) {
    console.error('Callback without chat ID')
    return
  }

  // Process callback
}
```

### Error Handling

```typescript
async function handleCallback(query: CallbackQuery) {
  try {
    await processCallback(query)
  } catch (error) {
    console.error('Callback error:', error)
    await bot.sendMessage({
      chat_id: query.message!.chat.id,
      text: '❌ An error occurred. Please try again.'
    })
  }
}
```

### Type Safety

```typescript
type CallbackData =
  | { type: 'vehicle'; id: number }
  | { type: 'menu'; page: string }

function parseCallback(data: string): CallbackData | null {
  if (data.startsWith('vehicle_')) {
    return { type: 'vehicle', id: parseInt(data.split('_')[1]) }
  }
  if (data.startsWith('menu_')) {
    return { type: 'menu', page: data.split('_')[1] }
  }
  return null
}
```

## Important Limitations

- **callback_data** has a 64-byte limit
- For larger data, store it in your database and use only an ID in the callback
- Callbacks can expire; always validate the context is still valid

## TypeScript Types

All callback-related types are fully typed and exported:

```typescript
import type {
  CallbackQuery,
  InlineKeyboardMarkup,
  InlineKeyboardButton,
  Message
} from 'telegram-api-fetch'

// Message includes reply_markup field
const message: Message = {
  message_id: 123,
  date: Date.now(),
  chat: { id: 456, type: 'private' },
  reply_markup: {
    inline_keyboard: [[{ text: 'Button', callback_data: 'data' }]]
  }
}
```

## Complete Example

See [`callback-example.ts`](./callback-example.ts) for a comprehensive example including:
- Dynamic list selection
- Multi-level navigation
- Interactive checklists
- Type-safe callback handling

## More Information

- [Telegram Bot API - CallbackQuery](https://core.telegram.org/bots/api#callbackquery)
- [Telegram Bot API - InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup)