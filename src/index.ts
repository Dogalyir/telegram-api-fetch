/**
 * Telegram Bot API TypeScript Type Definitions
 *
 * This library provides Zod schemas and TypeScript types for the Telegram Bot API,
 * with a focus on webhook payloads and a complete API client.
 *
 * @packageDocumentation
 *
 * @example
 * ```typescript
 * import { TelegramBot, UpdateSchema, type Update } from 'telegram-api-fetch'
 *
 * // Create a bot client
 * const bot = new TelegramBot({
 *   botToken: process.env.TELEGRAM_BOT_TOKEN!
 * })
 *
 * // Set webhook
 * await bot.setWebhook({
 *   url: 'https://example.com/webhook',
 *   secret_token: 'my-secret'
 * })
 *
 * // Send a message
 * await bot.sendMessage({
 *   chat_id: 123456789,
 *   text: 'Hello from Telegram Bot API!'
 * })
 *
 * // Validate incoming webhook updates
 * app.post('/webhook', (req, res) => {
 *   const update = UpdateSchema.parse(req.body)
 *
 *   if (update.message?.text) {
 *     console.log('Received message:', update.message.text)
 *   }
 *
 *   res.sendStatus(200)
 * })
 * ```
 */

export type {
	SendMessageParams,
	SendMessageResponse,
	SendPhotoParams,
	SendPhotoResponse,
	SetWebhookParams,
	SetWebhookResponse,
	TelegramMessage,
} from './client'
// Export the Telegram Bot API client
export { TelegramBot } from './client'
export type {
	TelegramConfig,
	TelegramErrorResponse,
	TelegramResponse,
	TelegramSuccessResponse,
} from './client/config'
export {
	TelegramAPIError,
	TelegramConfigSchema,
} from './client/config'
// Export client types and schemas
export type {
	ForceReply,
	InlineKeyboardButton,
	InlineKeyboardMarkup,
	KeyboardButton,
	ReplyKeyboardMarkup,
	ReplyKeyboardRemove,
	ReplyMarkup,
} from './client/keyboards'
export {
	ForceReplySchema,
	InlineKeyboardButtonSchema,
	InlineKeyboardMarkupSchema,
	KeyboardButtonSchema,
	ReplyKeyboardMarkupSchema,
	ReplyKeyboardRemoveSchema,
	ReplyMarkupSchema,
} from './client/keyboards'
export type {
	CallbackQuery,
	Chat,
	Location,
	Message,
	MessageEntity,
	PhotoSize,
	Update,
	User,
} from './webhooks'
// Export all webhook schemas and types
export {
	CallbackQuerySchema,
	ChatSchema,
	LocationSchema,
	MessageEntitySchema,
	MessageSchema,
	PhotoSizeSchema,
	UpdateSchema,
	UserSchema,
} from './webhooks'
