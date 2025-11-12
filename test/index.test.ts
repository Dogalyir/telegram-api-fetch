import { expect, test } from 'bun:test'
import {
	CallbackQuerySchema,
	ChatSchema,
	InlineKeyboardMarkupSchema,
	MessageSchema,
	PhotoSizeSchema,
	ReplyKeyboardMarkupSchema,
	TelegramBot,
	UpdateSchema,
	UserSchema,
} from '../src'

test('should parse a text message update', () => {
	const update = {
		update_id: 50563505,
		message: {
			message_id: 19787,
			from: {
				id: 496499134,
				is_bot: false,
				first_name: 'Carmelo',
				last_name: 'Campos',
				username: 'CamposCarmelo',
				language_code: 'es',
				is_premium: true,
			},
			chat: {
				id: 496499134,
				first_name: 'Carmelo',
				last_name: 'Campos',
				username: 'CamposCarmelo',
				type: 'private',
			},
			date: 1762922251,
			text: 'Este es un texto de ejemplo',
		},
	}

	const parsed = UpdateSchema.parse(update)
	expect(parsed.update_id).toBe(50563505)
	expect(parsed.message?.text).toBe('Este es un texto de ejemplo')
	expect(parsed.message?.from?.username).toBe('CamposCarmelo')
})

test('should parse a photo message update', () => {
	const update = {
		update_id: 50563506,
		message: {
			message_id: 19788,
			from: {
				id: 496499134,
				is_bot: false,
				first_name: 'Carmelo',
				last_name: 'Campos',
				username: 'CamposCarmelo',
				language_code: 'es',
				is_premium: true,
			},
			chat: {
				id: 496499134,
				first_name: 'Carmelo',
				last_name: 'Campos',
				username: 'CamposCarmelo',
				type: 'private',
			},
			date: 1762922312,
			photo: [
				{
					file_id:
						'AgACAgEAAxkBAAJNTGkUD0g6Og2DuKoQ_sd268xLngABOgACOQxrG7o2oUTCXbljTU8zMwEAAwIAA3MAAzYE',
					file_unique_id: 'AQADOQxrG7o2oUR4',
					file_size: 1456,
					width: 90,
					height: 73,
				},
				{
					file_id:
						'AgACAgEAAxkBAAJNTGkUD0g6Og2DuKoQ_sd268xLngABOgACOQxrG7o2oUTCXbljTU8zMwEAAwIAA20AAzYE',
					file_unique_id: 'AQADOQxrG7o2oURy',
					file_size: 24084,
					width: 320,
					height: 260,
				},
			],
		},
	}

	const parsed = UpdateSchema.parse(update)
	expect(parsed.update_id).toBe(50563506)
	expect(parsed.message?.photo).toBeDefined()
	expect(parsed.message?.photo?.length).toBe(2)
	expect(parsed.message?.photo?.[0]?.width).toBe(90)
})

test('UserSchema should validate user data', () => {
	const user = {
		id: 123456,
		is_bot: false,
		first_name: 'John',
		last_name: 'Doe',
		username: 'johndoe',
		language_code: 'en',
	}

	const parsed = UserSchema.parse(user)
	expect(parsed.id).toBe(123456)
	expect(parsed.first_name).toBe('John')
})

test('ChatSchema should validate chat data', () => {
	const chat = {
		id: 123456,
		type: 'private',
		first_name: 'John',
		username: 'johndoe',
	}

	const parsed = ChatSchema.parse(chat)
	expect(parsed.id).toBe(123456)
	expect(parsed.type).toBe('private')
})

test('PhotoSizeSchema should validate photo size data', () => {
	const photo = {
		file_id: 'ABC123',
		file_unique_id: 'XYZ789',
		width: 1280,
		height: 720,
		file_size: 50000,
	}

	const parsed = PhotoSizeSchema.parse(photo)
	expect(parsed.width).toBe(1280)
	expect(parsed.height).toBe(720)
})

test('InlineKeyboardMarkupSchema should validate inline keyboard', () => {
	const keyboard = {
		inline_keyboard: [
			[
				{ text: 'Button 1', callback_data: 'btn_1' },
				{ text: 'Button 2', url: 'https://example.com' },
			],
			[{ text: 'Button 3', callback_data: 'btn_3' }],
		],
	}

	const parsed = InlineKeyboardMarkupSchema.parse(keyboard)
	expect(parsed.inline_keyboard.length).toBe(2)
	expect(parsed.inline_keyboard[0]?.length).toBe(2)
	expect(parsed.inline_keyboard[0]?.[0]?.text).toBe('Button 1')
})

test('ReplyKeyboardMarkupSchema should validate reply keyboard', () => {
	const keyboard = {
		keyboard: [
			[{ text: 'Button 1' }, { text: 'Button 2' }],
			[{ text: 'Button 3' }],
		],
		resize_keyboard: true,
		one_time_keyboard: true,
	}

	const parsed = ReplyKeyboardMarkupSchema.parse(keyboard)
	expect(parsed.keyboard.length).toBe(2)
	expect(parsed.resize_keyboard).toBe(true)
	expect(parsed.one_time_keyboard).toBe(true)
})

test('TelegramBot should initialize with valid config', () => {
	const bot = new TelegramBot({
		botToken: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz',
	})

	expect(bot.config.botToken).toBe('123456789:ABCdefGHIjklMNOpqrsTUVwxyz')
	expect(bot.config.baseUrl).toBe('https://api.telegram.org')
	expect(bot.config.timeout).toBe(30000)
})

test('TelegramBot should mask bot token', () => {
	const bot = new TelegramBot({
		botToken: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz',
	})

	const masked = bot.getBotTokenMasked()
	expect(masked).toContain('...')
	expect(masked).not.toContain('ABCdefGHIjklMNOpqrsTUVwxyz')
})

test('TelegramBot should update bot token', () => {
	const bot = new TelegramBot({
		botToken: 'old_token',
	})

	bot.updateBotToken('new_token')
	expect(bot.config.botToken).toBe('new_token')
})

test('CallbackQuerySchema should validate callback query', () => {
	const callbackQuery = {
		id: 'query123',
		from: {
			id: 123456,
			is_bot: false,
			first_name: 'John',
		},
		chat_instance: 'chat123',
		data: 'button_clicked',
	}

	const parsed = CallbackQuerySchema.parse(callbackQuery)
	expect(parsed.id).toBe('query123')
	expect(parsed.data).toBe('button_clicked')
})

test('MessageSchema should validate message with entities', () => {
	const message = {
		message_id: 123,
		date: 1234567890,
		chat: {
			id: 123456,
			type: 'private',
		},
		text: 'Hello @username',
		entities: [
			{
				type: 'mention',
				offset: 6,
				length: 9,
			},
		],
	}

	const parsed = MessageSchema.parse(message)
	expect(parsed.text).toBe('Hello @username')
	expect(parsed.entities?.length).toBe(1)
	expect(parsed.entities?.[0]?.type).toBe('mention')
})
