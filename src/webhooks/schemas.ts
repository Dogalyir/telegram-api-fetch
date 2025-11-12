/**
 * Telegram Bot API Webhook Schemas
 *
 * Zod schemas for validating incoming webhook updates from Telegram Bot API
 * Based on the official Telegram Bot API documentation
 */

import { z } from 'zod'
import { InlineKeyboardMarkupSchema } from '../client/keyboards'

/**
 * User object represents a Telegram user or bot
 */
export const UserSchema = z.object({
	id: z.number().int().describe('Unique identifier for this user or bot'),
	is_bot: z.boolean().describe('True, if this user is a bot'),
	first_name: z.string().describe("User's or bot's first name"),
	last_name: z.string().optional().describe("User's or bot's last name"),
	username: z.string().optional().describe("User's or bot's username"),
	language_code: z
		.string()
		.optional()
		.describe("IETF language tag of the user's language"),
	is_premium: z
		.boolean()
		.optional()
		.describe('True, if this user is a Telegram Premium user'),
	added_to_attachment_menu: z
		.boolean()
		.optional()
		.describe('True, if this user added the bot to the attachment menu'),
	can_join_groups: z
		.boolean()
		.optional()
		.describe(
			'True, if the bot can be invited to groups. Returned only in getMe.',
		),
	can_read_all_group_messages: z
		.boolean()
		.optional()
		.describe(
			'True, if privacy mode is disabled for the bot. Returned only in getMe.',
		),
	supports_inline_queries: z
		.boolean()
		.optional()
		.describe(
			'True, if the bot supports inline queries. Returned only in getMe.',
		),
})

export type User = z.infer<typeof UserSchema>

/**
 * Chat object represents a chat
 */
export const ChatSchema = z.object({
	id: z.number().int().describe('Unique identifier for this chat'),
	type: z
		.enum(['private', 'group', 'supergroup', 'channel'])
		.describe('Type of chat'),
	title: z
		.string()
		.optional()
		.describe('Title, for supergroups, channels and group chats'),
	username: z
		.string()
		.optional()
		.describe(
			'Username, for private chats, supergroups and channels if available',
		),
	first_name: z
		.string()
		.optional()
		.describe('First name of the other party in a private chat'),
	last_name: z
		.string()
		.optional()
		.describe('Last name of the other party in a private chat'),
	is_forum: z
		.boolean()
		.optional()
		.describe('True, if the supergroup chat is a forum (has topics enabled)'),
})

export type Chat = z.infer<typeof ChatSchema>

/**
 * PhotoSize object represents one size of a photo or a file / sticker thumbnail
 */
export const PhotoSizeSchema = z.object({
	file_id: z
		.string()
		.describe(
			'Identifier for this file, which can be used to download or reuse the file',
		),
	file_unique_id: z
		.string()
		.describe(
			"Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.",
		),
	width: z.number().int().describe('Photo width'),
	height: z.number().int().describe('Photo height'),
	file_size: z.number().int().optional().describe('File size in bytes'),
})

export type PhotoSize = z.infer<typeof PhotoSizeSchema>

/**
 * Location object represents a point on the map
 */
export const LocationSchema = z.object({
	longitude: z.number().describe('Longitude as defined by sender'),
	latitude: z.number().describe('Latitude as defined by sender'),
	horizontal_accuracy: z
		.number()
		.optional()
		.describe(
			'The radius of uncertainty for the location, measured in meters; 0-1500',
		),
	live_period: z
		.number()
		.int()
		.optional()
		.describe(
			'Time relative to the message sending date, during which the location can be updated; in seconds. For active live locations only.',
		),
	heading: z
		.number()
		.int()
		.optional()
		.describe(
			'The direction in which user is moving, in degrees; 1-360. For active live locations only.',
		),
	proximity_alert_radius: z
		.number()
		.int()
		.optional()
		.describe(
			'The maximum distance for proximity alerts about approaching another chat member, in meters. For sent live locations only.',
		),
})

export type Location = z.infer<typeof LocationSchema>

/**
 * MessageEntity object represents one special entity in a text message
 */
export const MessageEntitySchema = z.object({
	type: z
		.enum([
			'mention',
			'hashtag',
			'cashtag',
			'bot_command',
			'url',
			'email',
			'phone_number',
			'bold',
			'italic',
			'underline',
			'strikethrough',
			'spoiler',
			'code',
			'pre',
			'text_link',
			'text_mention',
			'custom_emoji',
		])
		.describe('Type of the entity'),
	offset: z
		.number()
		.int()
		.describe('Offset in UTF-16 code units to the start of the entity'),
	length: z
		.number()
		.int()
		.describe('Length of the entity in UTF-16 code units'),
	url: z
		.string()
		.optional()
		.describe(
			'For "text_link" only, URL that will be opened after user taps on the text',
		),
	user: z
		.lazy(() => UserSchema)
		.optional()
		.describe('For "text_mention" only, the mentioned user'),
	language: z
		.string()
		.optional()
		.describe('For "pre" only, the programming language of the entity text'),
	custom_emoji_id: z
		.string()
		.optional()
		.describe('For "custom_emoji" only, unique identifier of the custom emoji'),
})

export type MessageEntity = z.infer<typeof MessageEntitySchema>

/**
 * Message object represents a message
 */
export interface Message {
	message_id: number
	message_thread_id?: number
	from?: User
	sender_chat?: Chat
	date: number
	chat: Chat
	forward_from?: User
	forward_from_chat?: Chat
	forward_from_message_id?: number
	forward_signature?: string
	forward_sender_name?: string
	forward_date?: number
	is_topic_message?: boolean
	is_automatic_forward?: boolean
	reply_to_message?: Message
	via_bot?: User
	edit_date?: number
	has_protected_content?: boolean
	media_group_id?: string
	author_signature?: string
	text?: string
	entities?: MessageEntity[]
	caption?: string
	caption_entities?: MessageEntity[]
	photo?: PhotoSize[]
	location?: Location
	reply_markup?: z.infer<typeof InlineKeyboardMarkupSchema>
}

export const MessageSchema: z.ZodType<Message> = z.object({
	message_id: z
		.number()
		.int()
		.describe('Unique message identifier inside this chat'),
	message_thread_id: z
		.number()
		.int()
		.optional()
		.describe(
			'Unique identifier of a message thread to which the message belongs; for supergroups only',
		),
	from: UserSchema.optional().describe(
		'Sender of the message; empty for messages sent to channels',
	),
	sender_chat: ChatSchema.optional().describe(
		'Sender of the message, sent on behalf of a chat',
	),
	date: z.number().int().describe('Date the message was sent in Unix time'),
	chat: ChatSchema.describe('Conversation the message belongs to'),
	forward_from: UserSchema.optional().describe(
		'For forwarded messages, sender of the original message',
	),
	forward_from_chat: ChatSchema.optional().describe(
		'For messages forwarded from channels or from anonymous administrators, information about the original sender chat',
	),
	forward_from_message_id: z
		.number()
		.int()
		.optional()
		.describe(
			'For messages forwarded from channels, identifier of the original message in the channel',
		),
	forward_signature: z
		.string()
		.optional()
		.describe(
			'For forwarded messages that were originally sent in channels or by an anonymous chat administrator, signature of the message sender if present',
		),
	forward_sender_name: z
		.string()
		.optional()
		.describe(
			"Sender's name for messages forwarded from users who disallow adding a link to their account in forwarded messages",
		),
	forward_date: z
		.number()
		.int()
		.optional()
		.describe(
			'For forwarded messages, date the original message was sent in Unix time',
		),
	is_topic_message: z
		.boolean()
		.optional()
		.describe('True, if the message is sent to a forum topic'),
	is_automatic_forward: z
		.boolean()
		.optional()
		.describe(
			'True, if the message is a channel post that was automatically forwarded to the connected discussion group',
		),
	reply_to_message: z
		.lazy((): z.ZodType<Message> => MessageSchema)
		.optional()
		.describe('For replies, the original message'),
	via_bot: UserSchema.optional().describe(
		'Bot through which the message was sent',
	),
	edit_date: z
		.number()
		.int()
		.optional()
		.describe('Date the message was last edited in Unix time'),
	has_protected_content: z
		.boolean()
		.optional()
		.describe("True, if the message can't be forwarded"),
	media_group_id: z
		.string()
		.optional()
		.describe(
			'The unique identifier of a media message group this message belongs to',
		),
	author_signature: z
		.string()
		.optional()
		.describe(
			'Signature of the post author for messages in channels, or the custom title of an anonymous group administrator',
		),
	text: z
		.string()
		.optional()
		.describe('For text messages, the actual UTF-8 text of the message'),
	entities: z
		.array(MessageEntitySchema)
		.optional()
		.describe(
			'For text messages, special entities like usernames, URLs, bot commands, etc. that appear in the text',
		),
	caption: z
		.string()
		.optional()
		.describe(
			'Caption for the animation, audio, document, photo, video or voice',
		),
	caption_entities: z
		.array(MessageEntitySchema)
		.optional()
		.describe(
			'For messages with a caption, special entities like usernames, URLs, bot commands, etc. that appear in the caption',
		),
	photo: z
		.array(PhotoSizeSchema)
		.optional()
		.describe('Message is a photo, available sizes of the photo'),
	location: LocationSchema.optional().describe(
		'Message is a shared location, information about the location',
	),
	reply_markup: InlineKeyboardMarkupSchema.optional().describe(
		'Inline keyboard attached to the message',
	),
})

/**
 * CallbackQuery object represents an incoming callback query from a callback button
 */
export const CallbackQuerySchema = z.object({
	id: z.string().describe('Unique identifier for this query'),
	from: UserSchema.describe('Sender'),
	message: MessageSchema.optional().describe(
		'Message with the callback button that originated the query',
	),
	inline_message_id: z
		.string()
		.optional()
		.describe(
			'Identifier of the message sent via the bot in inline mode, that originated the query',
		),
	chat_instance: z
		.string()
		.describe(
			'Global identifier, uniquely corresponding to the chat to which the message with the callback button was sent',
		),
	data: z
		.string()
		.optional()
		.describe('Data associated with the callback button'),
	game_short_name: z
		.string()
		.optional()
		.describe(
			'Short name of a Game to be returned, serves as the unique identifier for the game',
		),
})

export type CallbackQuery = z.infer<typeof CallbackQuerySchema>

/**
 * Update object represents an incoming update
 */
export const UpdateSchema = z.object({
	update_id: z.number().int().describe("The update's unique identifier"),
	message: MessageSchema.optional().describe(
		'New incoming message of any kind - text, photo, sticker, etc.',
	),
	edited_message: MessageSchema.optional().describe(
		'New version of a message that is known to the bot and was edited',
	),
	channel_post: MessageSchema.optional().describe(
		'New incoming channel post of any kind - text, photo, sticker, etc.',
	),
	edited_channel_post: MessageSchema.optional().describe(
		'New version of a channel post that is known to the bot and was edited',
	),
	callback_query: CallbackQuerySchema.optional().describe(
		'New incoming callback query',
	),
})

export type Update = z.infer<typeof UpdateSchema>
