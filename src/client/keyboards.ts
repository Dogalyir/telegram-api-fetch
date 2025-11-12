/**
 * Telegram Bot API Keyboard Types
 *
 * Schemas and types for inline and reply keyboards
 */

import { z } from 'zod'

/**
 * InlineKeyboardButton represents one button of an inline keyboard
 */
export const InlineKeyboardButtonSchema = z.object({
	/**
	 * Label text on the button
	 */
	text: z.string(),

	/**
	 * HTTP or tg:// URL to be opened when the button is pressed
	 */
	url: z.string().optional(),

	/**
	 * Data to be sent in a callback query to the bot when button is pressed, 1-64 bytes
	 */
	callback_data: z.string().max(64).optional(),

	/**
	 * Description of the Web App that will be launched when the user presses the button
	 */
	web_app: z
		.object({
			url: z.string().url(),
		})
		.optional(),

	/**
	 * An HTTPS URL used to automatically authorize the user
	 */
	login_url: z
		.object({
			url: z.string().url(),
			forward_text: z.string().optional(),
			bot_username: z.string().optional(),
			request_write_access: z.boolean().optional(),
		})
		.optional(),

	/**
	 * If set, pressing the button will prompt the user to select one of their chats
	 */
	switch_inline_query: z.string().optional(),

	/**
	 * If set, pressing the button will insert the bot's username and the specified inline query in the current chat's input field
	 */
	switch_inline_query_current_chat: z.string().optional(),

	/**
	 * If set, pressing the button will prompt the user to select one of their chats of the specified type
	 */
	switch_inline_query_chosen_chat: z
		.object({
			query: z.string().optional(),
			allow_user_chats: z.boolean().optional(),
			allow_bot_chats: z.boolean().optional(),
			allow_group_chats: z.boolean().optional(),
			allow_channel_chats: z.boolean().optional(),
		})
		.optional(),

	/**
	 * Description of the game that will be launched when the user presses the button
	 */
	callback_game: z.object({}).optional(),

	/**
	 * Specify True, to send a Pay button
	 */
	pay: z.boolean().optional(),
})

export type InlineKeyboardButton = z.infer<typeof InlineKeyboardButtonSchema>

/**
 * InlineKeyboardMarkup represents an inline keyboard that appears right next to the message it belongs to
 */
export const InlineKeyboardMarkupSchema = z.object({
	/**
	 * Array of button rows, each represented by an Array of InlineKeyboardButton objects
	 */
	inline_keyboard: z.array(z.array(InlineKeyboardButtonSchema)),
})

export type InlineKeyboardMarkup = z.infer<typeof InlineKeyboardMarkupSchema>

/**
 * KeyboardButton represents one button of the reply keyboard
 */
export const KeyboardButtonSchema = z.object({
	/**
	 * Text of the button
	 */
	text: z.string(),

	/**
	 * If specified, pressing the button will open a list of suitable users
	 */
	request_users: z
		.object({
			request_id: z.number().int(),
			user_is_bot: z.boolean().optional(),
			user_is_premium: z.boolean().optional(),
			max_quantity: z.number().int().optional(),
			request_name: z.boolean().optional(),
			request_username: z.boolean().optional(),
			request_photo: z.boolean().optional(),
		})
		.optional(),

	/**
	 * If specified, pressing the button will open a list of suitable chats
	 */
	request_chat: z
		.object({
			request_id: z.number().int(),
			chat_is_channel: z.boolean(),
			chat_is_forum: z.boolean().optional(),
			chat_has_username: z.boolean().optional(),
			chat_is_created: z.boolean().optional(),
			user_administrator_rights: z.record(z.string(), z.boolean()).optional(),
			bot_administrator_rights: z.record(z.string(), z.boolean()).optional(),
			bot_is_member: z.boolean().optional(),
			request_title: z.boolean().optional(),
			request_username: z.boolean().optional(),
			request_photo: z.boolean().optional(),
		})
		.optional(),

	/**
	 * If True, the user's phone number will be sent as a contact when the button is pressed
	 */
	request_contact: z.boolean().optional(),

	/**
	 * If True, the user's current location will be sent when the button is pressed
	 */
	request_location: z.boolean().optional(),

	/**
	 * If specified, the user will be asked to create a poll and send it to the bot when the button is pressed
	 */
	request_poll: z
		.object({
			type: z.enum(['quiz', 'regular']).optional(),
		})
		.optional(),

	/**
	 * If specified, the described Web App will be launched when the button is pressed
	 */
	web_app: z
		.object({
			url: z.string().url(),
		})
		.optional(),
})

export type KeyboardButton = z.infer<typeof KeyboardButtonSchema>

/**
 * ReplyKeyboardMarkup represents a custom keyboard with reply options
 */
export const ReplyKeyboardMarkupSchema = z.object({
	/**
	 * Array of button rows, each represented by an Array of KeyboardButton objects
	 */
	keyboard: z.array(z.array(KeyboardButtonSchema)),

	/**
	 * Requests clients to always show the keyboard when the regular keyboard is hidden
	 */
	is_persistent: z.boolean().optional(),

	/**
	 * Requests clients to resize the keyboard vertically for optimal fit
	 */
	resize_keyboard: z.boolean().optional(),

	/**
	 * Requests clients to hide the keyboard as soon as it's been used
	 */
	one_time_keyboard: z.boolean().optional(),

	/**
	 * The placeholder to be shown in the input field when the keyboard is active
	 */
	input_field_placeholder: z.string().max(64).optional(),

	/**
	 * Use this parameter if you want to show the keyboard to specific users only
	 */
	selective: z.boolean().optional(),
})

export type ReplyKeyboardMarkup = z.infer<typeof ReplyKeyboardMarkupSchema>

/**
 * ReplyKeyboardRemove requests clients to remove the custom keyboard
 */
export const ReplyKeyboardRemoveSchema = z.object({
	/**
	 * Requests clients to remove the custom keyboard
	 */
	remove_keyboard: z.literal(true),

	/**
	 * Use this parameter if you want to remove the keyboard for specific users only
	 */
	selective: z.boolean().optional(),
})

export type ReplyKeyboardRemove = z.infer<typeof ReplyKeyboardRemoveSchema>

/**
 * ForceReply forces Telegram clients to display a reply interface to the user
 */
export const ForceReplySchema = z.object({
	/**
	 * Shows reply interface to the user
	 */
	force_reply: z.literal(true),

	/**
	 * The placeholder to be shown in the input field when the reply is active
	 */
	input_field_placeholder: z.string().max(64).optional(),

	/**
	 * Use this parameter if you want to force reply from specific users only
	 */
	selective: z.boolean().optional(),
})

export type ForceReply = z.infer<typeof ForceReplySchema>

/**
 * Union type for all reply markup types
 */
export const ReplyMarkupSchema = z.union([
	InlineKeyboardMarkupSchema,
	ReplyKeyboardMarkupSchema,
	ReplyKeyboardRemoveSchema,
	ForceReplySchema,
])

export type ReplyMarkup = z.infer<typeof ReplyMarkupSchema>
