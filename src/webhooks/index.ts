/**
 * Telegram Bot API Webhook Types and Schemas
 *
 * This module exports Zod schemas and TypeScript types for validating
 * incoming webhook updates from the Telegram Bot API.
 *
 * @example
 * ```typescript
 * import { UpdateSchema, type Update } from 'telegram-api-fetch'
 *
 * // Validate incoming webhook payload
 * const update = UpdateSchema.parse(req.body)
 *
 * // Type-safe access to update data
 * if (update.message) {
 *   console.log('Received message:', update.message.text)
 *   console.log('From:', update.message.from?.username)
 * }
 *
 * if (update.callback_query) {
 *   console.log('Callback data:', update.callback_query.data)
 * }
 * ```
 *
 * @packageDocumentation
 */

export type {
	CallbackQuery,
	Chat,
	Location,
	Message,
	MessageEntity,
	PhotoSize,
	Update,
	User,
} from './schemas'
export {
	CallbackQuerySchema,
	ChatSchema,
	LocationSchema,
	MessageEntitySchema,
	MessageSchema,
	PhotoSizeSchema,
	UpdateSchema,
	UserSchema,
} from './schemas'
