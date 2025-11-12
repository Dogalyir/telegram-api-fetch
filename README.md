# telegram-api-fetch

TypeScript type definitions and client for the Telegram Bot API using Zod schemas.

[![npm version](https://img.shields.io/npm/v/telegram-api-fetch.svg)](https://www.npmjs.com/package/telegram-api-fetch)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔒 **Type-Safe**: Full TypeScript support with Zod schema validation
- 🚀 **Modern**: Built with Bun.sh and ESM modules
- 📦 **Lightweight**: Zero dependencies except Zod
- 🎯 **Focused**: Currently supports webhook validation and essential bot methods
- 🔄 **Validated**: Automatic runtime validation of incoming webhook updates
- 🎨 **Keyboards**: Full support for InlineKeyboardMarkup and ReplyKeyboardMarkup

## Installation

```bash
# Using Bun (recommended)
bun add telegram-api-fetch

# Using npm
npm install telegram-api-fetch

# Using yarn
yarn add telegram-api-fetch

# Using pnpm
pnpm add telegram-api-fetch
```

## Quick Start

### Creating a Bot Client

```typescript
import { TelegramBot } from 'telegram-api-fetch'

const bot = new TelegramBot({
  botToken: process.env.TELEGRAM_BOT_TOKEN!
})
```

### Setting Up a Webhook

```typescript
await bot.setWebhook({
  url: 'https://your-domain.com/webhook',
  secret_token: 'your-secret-token',
  allowed_updates: ['message', 'callback_query']
})
```

### Sending Messages

```typescript
// Simple text message
await bot.sendMessage({
  chat_id: 123456789,
  text: 'Hello from Telegram Bot API!'
})

// Message with inline keyboard
await bot.sendMessage({
  chat_id: 123456789,
  text: 'Choose an option:',
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'Option 1', callback_data: 'opt_1' },
        { text: 'Option 2', callback_data: 'opt_2' }
      ]
    ]
  }
})

// Message with reply keyboard
await bot.sendMessage({
  chat_id: 123456789,
  text: 'Select from keyboard:',
  reply_markup: {
    keyboard: [
      [{ text: 'Button 1' }, { text: 'Button 2' }],
      [{ text: 'Share Contact', request_contact: true }]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  }
})
```

### Sending Photos

```typescript
// Send photo by URL
await bot.sendPhoto({
  chat_id: 123456789,
  photo: 'https://example.com/image.jpg',
  caption: 'Check this out!'
})

// Send photo with inline keyboard
await bot.sendPhoto({
  chat_id: 123456789,
  photo: 'https://example.com/image.jpg',
  caption: 'Do you like it?',
  reply_markup: {
    inline_keyboard: [
      [
        { text: '👍 Like', callback_data: 'like' },
        { text: '👎 Dislike', callback_data: 'dislike' }
      ]
    ]
  }
})

// Send photo by file_id
await bot.sendPhoto({
  chat_id: 123456789,
  photo: 'AgACAgIAAxkBAAIBY2...'
})
```

### Validating Webhook Updates

```typescript
import { UpdateSchema, type Update } from 'telegram-api-fetch'

// In your webhook handler
app.post('/webhook', async (req, res) => {
  // Verify secret token (recommended)
  const secretToken = req.headers['x-telegram-bot-api-secret-token']
  if (secretToken !== 'your-secret-token') {
    return res.sendStatus(401)
  }

  // Validate and parse the update
  const update: Update = UpdateSchema.parse(req.body)

  // Handle text messages
  if (update.message?.text) {
    const chatId = update.message.chat.id
    const text = update.message.text

    await bot.sendMessage({
      chat_id: chatId,
      text: `You said: ${text}`
    })
  }

  // Handle callback queries
  if (update.callback_query) {
    const data = update.callback_query.data
    console.log('Callback data:', data)
  }

  res.sendStatus(200)
})
```

## API Reference

### TelegramBot

Main client class for interacting with the Telegram Bot API.

#### Constructor

```typescript
new TelegramBot(config: TelegramConfig)
```

**Config Options:**
- `botToken` (string, required): Your bot token from @BotFather
- `baseUrl` (string, optional): API base URL (default: `https://api.telegram.org`)
- `timeout` (number, optional): Request timeout in milliseconds (default: 30000)

#### Methods

##### `setWebhook(params: SetWebhookParams): Promise<boolean>`

Configure a webhook to receive updates.

**Parameters:**
- `url` (string): HTTPS URL to send updates to
- `secret_token` (string, optional): Secret token for webhook verification
- `allowed_updates` (string[], optional): List of update types to receive
- `max_connections` (number, optional): Maximum simultaneous connections
- `drop_pending_updates` (boolean, optional): Drop all pending updates

##### `sendMessage(params: SendMessageParams): Promise<TelegramMessage>`

Send a text message.

**Parameters:**
- `chat_id` (number | string): Target chat ID or username
- `text` (string): Message text
- `parse_mode` (string, optional): Parse mode (Markdown, HTML, MarkdownV2)
- `reply_markup` (object, optional): Inline or reply keyboard
- `reply_to_message_id` (number, optional): ID of message to reply to
- `disable_notification` (boolean, optional): Send silently
- And more...

##### `sendPhoto(params: SendPhotoParams): Promise<TelegramMessage>`

Send a photo.

**Parameters:**
- `chat_id` (number | string): Target chat ID or username
- `photo` (string | Blob | File): Photo URL, file_id, or file to upload
- `caption` (string, optional): Photo caption
- `parse_mode` (string, optional): Parse mode for caption
- `reply_markup` (object, optional): Inline or reply keyboard
- And more...

### Webhook Schemas

All webhook types are validated using Zod schemas:

- `UpdateSchema`: Main update object
- `MessageSchema`: Message object
- `UserSchema`: User object
- `ChatSchema`: Chat object
- `PhotoSizeSchema`: Photo size object
- `CallbackQuerySchema`: Callback query object
- `LocationSchema`: Location object
- `MessageEntitySchema`: Message entity object

### Keyboard Types

#### InlineKeyboardMarkup

```typescript
{
  inline_keyboard: [
    [
      { text: 'Button 1', callback_data: 'data_1' },
      { text: 'Button 2', url: 'https://example.com' }
    ]
  ]
}
```

#### ReplyKeyboardMarkup

```typescript
{
  keyboard: [
    [{ text: 'Button 1' }, { text: 'Button 2' }],
    [{ text: 'Share Contact', request_contact: true }]
  ],
  resize_keyboard: true,
  one_time_keyboard: true
}
```

## Examples

Check the [`examples/`](./examples) directory for complete examples:

- [`basic-bot.ts`](./examples/basic-bot.ts): Comprehensive example with all features

## Development

This project uses Bun.sh as the runtime and package manager.

```bash
# Install dependencies
bun install

# Run tests
bun test

# Run tests in watch mode
bun test:watch

# Build the library
bun run build

# Run linter
bun run lint:fix

# Type check
bun run type-check
```

## Current API Coverage

Currently implemented methods:

- ✅ `setWebhook` - Configure webhook
- ✅ `sendMessage` - Send text messages
- ✅ `sendPhoto` - Send photos

### Webhook Types

- ✅ Update validation
- ✅ Message types (text, photo, location)
- ✅ User and Chat types
- ✅ Callback queries
- ✅ Message entities

### Coming Soon

- `sendVideo` - Send videos
- `sendAudio` - Send audio files
- `sendDocument` - Send documents
- `editMessageText` - Edit messages
- `deleteMessage` - Delete messages
- And more...

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Dogalyir](https://github.com/Dogalyir)

## Links

- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [GitHub Repository](https://github.com/Dogalyir/telegram-api-fetch)
- [npm Package](https://www.npmjs.com/package/telegram-api-fetch)

## Acknowledgments

This library provides type-safe TypeScript bindings for the Telegram Bot API, with automatic validation using Zod schemas. Perfect for building reliable Telegram bots with full type safety.