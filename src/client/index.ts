/**
 * Telegram Bot API Client
 *
 * A TypeScript client for the Telegram Bot API with type-safe methods
 * for webhook management and message sending.
 *
 * @packageDocumentation
 */

import type { z } from 'zod'
import {
	TelegramAPIError,
	type TelegramConfig,
	TelegramConfigSchema,
	type TelegramErrorResponse,
	type TelegramResponse,
	type TelegramSuccessResponse,
} from './config'
import type {
	InlineKeyboardMarkup,
	ReplyKeyboardMarkup,
	ReplyMarkup,
} from './keyboards'

/**
 * SetWebhook method parameters
 */
export interface SetWebhookParams extends Record<string, unknown> {
	/**
	 * HTTPS URL to send updates to. Use an empty string to remove webhook integration
	 */
	url: string

	/**
	 * Upload your public key certificate so that the root certificate in use can be checked
	 */
	certificate?: Blob | File

	/**
	 * The fixed IP address which will be used to send webhook requests instead of the IP address resolved through DNS
	 */
	ip_address?: string

	/**
	 * The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. Defaults to 40
	 */
	max_connections?: number

	/**
	 * A JSON-serialized list of the update types you want your bot to receive
	 */
	allowed_updates?: string[]

	/**
	 * Pass True to drop all pending updates
	 */
	drop_pending_updates?: boolean

	/**
	 * A secret token to be sent in a header "X-Telegram-Bot-Api-Secret-Token" in every webhook request, 1-256 characters
	 */
	secret_token?: string
}

/**
 * SetWebhook response
 */
export interface SetWebhookResponse {
	ok: true
	result: boolean
	description?: string
}

/**
 * SendMessage method parameters
 */
export interface SendMessageParams extends Record<string, unknown> {
	/**
	 * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
	 */
	chat_id: number | string

	/**
	 * Text of the message to be sent, 1-4096 characters after entities parsing
	 */
	text: string

	/**
	 * Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
	 */
	message_thread_id?: number

	/**
	 * Mode for parsing entities in the message text
	 */
	parse_mode?: 'MarkdownV2' | 'Markdown' | 'HTML'

	/**
	 * List of special entities that appear in message text
	 */
	entities?: Array<{
		type: string
		offset: number
		length: number
		url?: string
		user?: unknown
		language?: string
	}>

	/**
	 * Disables link previews for links in this message
	 */
	disable_web_page_preview?: boolean

	/**
	 * Sends the message silently. Users will receive a notification with no sound
	 */
	disable_notification?: boolean

	/**
	 * Protects the contents of the sent message from forwarding and saving
	 */
	protect_content?: boolean

	/**
	 * If the message is a reply, ID of the original message
	 */
	reply_to_message_id?: number

	/**
	 * Pass True if the message should be sent even if the specified replied-to message is not found
	 */
	allow_sending_without_reply?: boolean

	/**
	 * Additional interface options. An InlineKeyboardMarkup or ReplyKeyboardMarkup object
	 */
	reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyMarkup
}

/**
 * Message object returned by Telegram API
 */
export interface TelegramMessage {
	message_id: number
	from?: {
		id: number
		is_bot: boolean
		first_name: string
		last_name?: string
		username?: string
	}
	chat: {
		id: number
		type: string
		title?: string
		username?: string
		first_name?: string
		last_name?: string
	}
	date: number
	text?: string
	photo?: Array<{
		file_id: string
		file_unique_id: string
		width: number
		height: number
		file_size?: number
	}>
	caption?: string
	[key: string]: unknown
}

/**
 * SendMessage response
 */
export interface SendMessageResponse {
	ok: true
	result: TelegramMessage
}

/**
 * SendPhoto method parameters
 */
export interface SendPhotoParams extends Record<string, unknown> {
	/**
	 * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
	 */
	chat_id: number | string

	/**
	 * Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended),
	 * pass an HTTP URL as a String for Telegram to get a photo from the Internet,
	 * or upload a new photo using multipart/form-data
	 */
	photo: string | Blob | File

	/**
	 * Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
	 */
	message_thread_id?: number

	/**
	 * Photo caption (may also be used when resending photos by file_id), 0-1024 characters after entities parsing
	 */
	caption?: string

	/**
	 * Mode for parsing entities in the photo caption
	 */
	parse_mode?: 'MarkdownV2' | 'Markdown' | 'HTML'

	/**
	 * List of special entities that appear in the caption
	 */
	caption_entities?: Array<{
		type: string
		offset: number
		length: number
		url?: string
		user?: unknown
		language?: string
	}>

	/**
	 * Pass True if the photo needs to be covered with a spoiler animation
	 */
	has_spoiler?: boolean

	/**
	 * Sends the message silently. Users will receive a notification with no sound
	 */
	disable_notification?: boolean

	/**
	 * Protects the contents of the sent message from forwarding and saving
	 */
	protect_content?: boolean

	/**
	 * If the message is a reply, ID of the original message
	 */
	reply_to_message_id?: number

	/**
	 * Pass True if the message should be sent even if the specified replied-to message is not found
	 */
	allow_sending_without_reply?: boolean

	/**
	 * Additional interface options. An InlineKeyboardMarkup or ReplyKeyboardMarkup object
	 */
	reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyMarkup
}

/**
 * SendPhoto response
 */
export interface SendPhotoResponse {
	ok: true
	result: TelegramMessage
}

/**
 * Telegram Bot API Client
 *
 * @example
 * ```typescript
 * const bot = new TelegramBot({
 *   botToken: 'YOUR_BOT_TOKEN'
 * })
 *
 * // Set webhook
 * await bot.setWebhook({
 *   url: 'https://example.com/webhook',
 *   secret_token: 'my-secret'
 * })
 *
 * // Send a text message
 * await bot.sendMessage({
 *   chat_id: 123456789,
 *   text: 'Hello, World!'
 * })
 *
 * // Send a photo with inline keyboard
 * await bot.sendPhoto({
 *   chat_id: 123456789,
 *   photo: 'https://example.com/image.jpg',
 *   caption: 'Check this out!',
 *   reply_markup: {
 *     inline_keyboard: [
 *       [
 *         { text: 'Visit Website', url: 'https://example.com' },
 *         { text: 'Callback', callback_data: 'action_1' }
 *       ]
 *     ]
 *   }
 * })
 * ```
 */
export class TelegramBot {
	/**
	 * Configuration for the Telegram Bot API client
	 */
	public readonly config: TelegramConfig

	/**
	 * Create a new Telegram Bot API client
	 *
	 * @param config - Configuration object
	 * @throws {z.ZodError} If configuration is invalid
	 *
	 * @example
	 * ```typescript
	 * const bot = new TelegramBot({
	 *   botToken: process.env.TELEGRAM_BOT_TOKEN!
	 * })
	 * ```
	 */
	constructor(config: z.input<typeof TelegramConfigSchema>) {
		// Validate and parse configuration
		this.config = TelegramConfigSchema.parse(config)
	}

	/**
	 * Get the base URL for API requests
	 * @private
	 */
	private getApiUrl(method: string): string {
		return `${this.config.baseUrl}/bot${this.config.botToken}/${method}`
	}

	/**
	 * Make an API request to Telegram
	 * @private
	 */
	private async request<T>(
		method: string,
		params?: Record<string, unknown>,
		isMultipart = false,
	): Promise<T> {
		const url = this.getApiUrl(method)

		const controller = new AbortController()
		const timeout = setTimeout(() => controller.abort(), this.config.timeout)

		try {
			let body: string | FormData
			const headers: Record<string, string> = {}

			if (isMultipart && params) {
				// Create FormData for multipart/form-data requests
				const formData = new FormData()
				for (const [key, value] of Object.entries(params)) {
					if (value === undefined || value === null) continue

					if (value instanceof Blob || value instanceof File) {
						formData.append(key, value)
					} else if (typeof value === 'object') {
						formData.append(key, JSON.stringify(value))
					} else {
						formData.append(key, String(value))
					}
				}
				body = formData
			} else {
				// Use JSON for regular requests
				headers['Content-Type'] = 'application/json'
				body = JSON.stringify(params || {})
			}

			const response = await fetch(url, {
				method: 'POST',
				headers,
				body,
				signal: controller.signal,
			})

			clearTimeout(timeout)

			const data = (await response.json()) as TelegramResponse<T>

			if (!data.ok) {
				const error = data as TelegramErrorResponse
				throw new TelegramAPIError(error.error_code, error.description)
			}

			return (data as TelegramSuccessResponse<T>).result
		} catch (error) {
			clearTimeout(timeout)

			if (error instanceof TelegramAPIError) {
				throw error
			}

			if (error instanceof Error) {
				if (error.name === 'AbortError') {
					throw new Error(`Request timeout after ${this.config.timeout}ms`)
				}
				throw error
			}

			throw new Error('Unknown error occurred during API request')
		}
	}

	/**
	 * Set a webhook to receive incoming updates via an outgoing webhook
	 *
	 * @param params - Webhook parameters
	 * @returns Promise with the result
	 *
	 * @example
	 * ```typescript
	 * // Set webhook with secret token
	 * await bot.setWebhook({
	 *   url: 'https://example.com/webhook',
	 *   secret_token: 'my-secret-token',
	 *   allowed_updates: ['message', 'callback_query']
	 * })
	 *
	 * // Remove webhook
	 * await bot.setWebhook({ url: '' })
	 * ```
	 */
	async setWebhook(params: SetWebhookParams): Promise<boolean> {
		const hasFile =
			(typeof Blob !== 'undefined' && params.certificate instanceof Blob) ||
			(typeof File !== 'undefined' && params.certificate instanceof File)
		return await this.request<boolean>('setWebhook', params, hasFile)
	}

	/**
	 * Send a text message
	 *
	 * @param params - Message parameters
	 * @returns Promise with the sent message
	 *
	 * @example
	 * ```typescript
	 * // Simple text message
	 * await bot.sendMessage({
	 *   chat_id: 123456789,
	 *   text: 'Hello, World!'
	 * })
	 *
	 * // With inline keyboard
	 * await bot.sendMessage({
	 *   chat_id: 123456789,
	 *   text: 'Choose an option:',
	 *   reply_markup: {
	 *     inline_keyboard: [
	 *       [
	 *         { text: 'Option 1', callback_data: 'opt_1' },
	 *         { text: 'Option 2', callback_data: 'opt_2' }
	 *       ]
	 *     ]
	 *   }
	 * })
	 *
	 * // With reply keyboard
	 * await bot.sendMessage({
	 *   chat_id: 123456789,
	 *   text: 'Choose from keyboard:',
	 *   reply_markup: {
	 *     keyboard: [
	 *       [{ text: 'Button 1' }, { text: 'Button 2' }],
	 *       [{ text: 'Button 3' }]
	 *     ],
	 *     resize_keyboard: true,
	 *     one_time_keyboard: true
	 *   }
	 * })
	 * ```
	 */
	async sendMessage(params: SendMessageParams): Promise<TelegramMessage> {
		return await this.request<TelegramMessage>('sendMessage', params)
	}

	/**
	 * Send a photo
	 *
	 * @param params - Photo parameters
	 * @returns Promise with the sent message
	 *
	 * @example
	 * ```typescript
	 * // Send by URL
	 * await bot.sendPhoto({
	 *   chat_id: 123456789,
	 *   photo: 'https://example.com/image.jpg',
	 *   caption: 'Beautiful image'
	 * })
	 *
	 * // Send by file_id
	 * await bot.sendPhoto({
	 *   chat_id: 123456789,
	 *   photo: 'AgACAgIAAxkBAAIBY2...'
	 * })
	 *
	 * // Upload new photo with inline keyboard
	 * const file = new File([photoBuffer], 'photo.jpg', { type: 'image/jpeg' })
	 * await bot.sendPhoto({
	 *   chat_id: 123456789,
	 *   photo: file,
	 *   caption: 'Uploaded photo',
	 *   reply_markup: {
	 *     inline_keyboard: [
	 *       [
	 *         { text: 'Like', callback_data: 'like' },
	 *         { text: 'Share', callback_data: 'share' }
	 *       ]
	 *     ]
	 *   }
	 * })
	 * ```
	 */
	async sendPhoto(params: SendPhotoParams): Promise<TelegramMessage> {
		const isFile =
			(typeof Blob !== 'undefined' && params.photo instanceof Blob) ||
			(typeof File !== 'undefined' && params.photo instanceof File)
		return await this.request<TelegramMessage>('sendPhoto', params, isFile)
	}

	/**
	 * Update the bot token
	 * Useful when the token needs to be rotated
	 *
	 * @param newBotToken - New bot token
	 */
	updateBotToken(newBotToken: string): void {
		this.config.botToken = newBotToken
	}

	/**
	 * Get the current bot token (masked for security)
	 */
	getBotTokenMasked(): string {
		const token = this.config.botToken
		if (token.length < 10) return '***'
		return `${token.slice(0, 3)}...${token.slice(-3)}`
	}
}

// Re-export types and schemas
export * from './config'
export * from './keyboards'
