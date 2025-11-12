/**
 * Telegram Bot API Client Configuration
 *
 * Configuration schema and types for the Telegram Bot API client
 */

import { z } from 'zod'

/**
 * Telegram Bot API Configuration Schema
 */
export const TelegramConfigSchema = z.object({
	/**
	 * Bot token obtained from @BotFather
	 * @example "123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
	 */
	botToken: z.string().min(1, 'Bot token is required'),

	/**
	 * Base URL for Telegram Bot API
	 * @default "https://api.telegram.org"
	 */
	baseUrl: z.string().url().default('https://api.telegram.org'),

	/**
	 * Request timeout in milliseconds
	 * @default 30000 (30 seconds)
	 */
	timeout: z.number().int().positive().default(30000),
})

/**
 * Telegram Bot API Configuration Type
 */
export type TelegramConfig = z.infer<typeof TelegramConfigSchema>

/**
 * Telegram Bot API Error Response
 */
export interface TelegramErrorResponse {
	ok: false
	error_code: number
	description: string
}

/**
 * Telegram Bot API Success Response
 */
export interface TelegramSuccessResponse<T = unknown> {
	ok: true
	result: T
}

/**
 * Telegram Bot API Response (Success or Error)
 */
export type TelegramResponse<T = unknown> =
	| TelegramSuccessResponse<T>
	| TelegramErrorResponse

/**
 * Custom error class for Telegram API errors
 */
export class TelegramAPIError extends Error {
	constructor(
		public errorCode: number,
		public description: string,
	) {
		super(`Telegram API Error ${errorCode}: ${description}`)
		this.name = 'TelegramAPIError'
	}
}
