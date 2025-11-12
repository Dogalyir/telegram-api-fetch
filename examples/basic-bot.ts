/**
 * Basic Telegram Bot Example
 *
 * This example demonstrates how to:
 * 1. Create a Telegram Bot instance
 * 2. Set up a webhook
 * 3. Send text messages with keyboards
 * 4. Send photos
 * 5. Handle incoming webhook updates
 */

import { TelegramBot, type Update, UpdateSchema } from '../src'

// Initialize the bot with your token from @BotFather
const bot = new TelegramBot({
	botToken: process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN',
})

/**
 * Set up webhook to receive updates
 */
async function setupWebhook() {
	try {
		const result = await bot.setWebhook({
			url: 'https://example.com/webhook',
			secret_token: 'my-super-secret-token',
			allowed_updates: ['message', 'callback_query'],
			drop_pending_updates: true,
		})

		console.log('Webhook set successfully:', result)
	} catch (error) {
		console.error('Error setting webhook:', error)
	}
}

/**
 * Send a simple text message
 */
async function sendSimpleMessage(chatId: number) {
	try {
		const message = await bot.sendMessage({
			chat_id: chatId,
			text: '¡Hola! Este es un mensaje de ejemplo desde Telegram Bot API',
		})

		console.log('Message sent:', message.message_id)
	} catch (error) {
		console.error('Error sending message:', error)
	}
}

/**
 * Send a message with inline keyboard
 */
async function sendMessageWithInlineKeyboard(chatId: number) {
	try {
		const message = await bot.sendMessage({
			chat_id: chatId,
			text: '¿Qué opción prefieres?',
			reply_markup: {
				inline_keyboard: [
					[
						{ text: '👍 Me gusta', callback_data: 'like' },
						{ text: '👎 No me gusta', callback_data: 'dislike' },
					],
					[{ text: '🌐 Visitar sitio web', url: 'https://telegram.org' }],
					[{ text: '🔍 Buscar en línea', switch_inline_query: 'query' }],
				],
			},
		})

		console.log('Message with inline keyboard sent:', message.message_id)
	} catch (error) {
		console.error('Error sending message with inline keyboard:', error)
	}
}

/**
 * Send a message with reply keyboard
 */
async function sendMessageWithReplyKeyboard(chatId: number) {
	try {
		const message = await bot.sendMessage({
			chat_id: chatId,
			text: 'Selecciona una opción del teclado:',
			reply_markup: {
				keyboard: [
					[{ text: '🏠 Inicio' }, { text: '⚙️ Configuración' }],
					[{ text: '📱 Compartir contacto', request_contact: true }],
					[{ text: '📍 Compartir ubicación', request_location: true }],
				],
				resize_keyboard: true,
				one_time_keyboard: true,
				input_field_placeholder: 'Elige una opción...',
			},
		})

		console.log('Message with reply keyboard sent:', message.message_id)
	} catch (error) {
		console.error('Error sending message with reply keyboard:', error)
	}
}

/**
 * Send a photo by URL
 */
async function sendPhotoByUrl(chatId: number) {
	try {
		const message = await bot.sendPhoto({
			chat_id: chatId,
			photo: 'https://telegram.org/img/t_logo.png',
			caption: '¡Mira esta imagen! 📸',
			parse_mode: 'Markdown',
		})

		console.log('Photo sent:', message.message_id)
	} catch (error) {
		console.error('Error sending photo:', error)
	}
}

/**
 * Send a photo with inline keyboard
 */
async function sendPhotoWithKeyboard(chatId: number) {
	try {
		const message = await bot.sendPhoto({
			chat_id: chatId,
			photo: 'https://telegram.org/img/t_logo.png',
			caption: '¿Te gusta esta imagen?',
			reply_markup: {
				inline_keyboard: [
					[
						{ text: '❤️ Me encanta', callback_data: 'love' },
						{ text: '👌 Está bien', callback_data: 'ok' },
					],
					[{ text: '💾 Guardar', callback_data: 'save' }],
				],
			},
		})

		console.log('Photo with keyboard sent:', message.message_id)
	} catch (error) {
		console.error('Error sending photo with keyboard:', error)
	}
}

/**
 * Send a photo using file_id (from a previously sent photo)
 */
async function _sendPhotoByFileId(chatId: number, fileId: string) {
	try {
		const message = await bot.sendPhoto({
			chat_id: chatId,
			photo: fileId,
			caption: 'Esta es una foto reenviada usando file_id',
		})

		console.log('Photo sent by file_id:', message.message_id)
	} catch (error) {
		console.error('Error sending photo by file_id:', error)
	}
}

/**
 * Handle incoming webhook updates
 * This function should be called from your webhook endpoint
 */
async function handleWebhookUpdate(body: unknown) {
	try {
		// Validate and parse the incoming update
		const update: Update = UpdateSchema.parse(body)

		console.log('Received update:', update.update_id)

		// Handle text messages
		if (update.message?.text) {
			const chatId = update.message.chat.id
			const text = update.message.text
			const username = update.message.from?.username || 'Usuario'

			console.log(`Message from @${username}: ${text}`)

			// Echo the message back
			if (text === '/start') {
				await sendMessageWithInlineKeyboard(chatId)
			} else if (text === '/keyboard') {
				await sendMessageWithReplyKeyboard(chatId)
			} else if (text === '/photo') {
				await sendPhotoByUrl(chatId)
			} else if (text === '/photo_keyboard') {
				await sendPhotoWithKeyboard(chatId)
			} else {
				await bot.sendMessage({
					chat_id: chatId,
					text: `Recibí tu mensaje: "${text}"`,
					reply_to_message_id: update.message.message_id,
				})
			}
		}

		// Handle photos
		if (update.message?.photo) {
			const chatId = update.message.chat.id
			const photo = update.message.photo[update.message.photo.length - 1] // Get largest photo

			console.log('Received photo:', photo?.file_id)

			await bot.sendMessage({
				chat_id: chatId,
				text: '¡Bonita foto! 📸',
			})
		}

		// Handle callback queries from inline keyboards
		if (update.callback_query) {
			const callbackData = update.callback_query.data
			const chatId = update.callback_query.message?.chat.id

			console.log('Callback query:', callbackData)

			if (chatId) {
				let responseText = ''

				switch (callbackData) {
					case 'like':
						responseText = '¡Te gustó! 👍'
						break
					case 'dislike':
						responseText = 'No te gustó 👎'
						break
					case 'love':
						responseText = '¡Te encantó! ❤️'
						break
					case 'ok':
						responseText = 'Está bien 👌'
						break
					case 'save':
						responseText = 'Guardado 💾'
						break
					default:
						responseText = `Presionaste: ${callbackData}`
				}

				await bot.sendMessage({
					chat_id: chatId,
					text: responseText,
				})
			}
		}
	} catch (error) {
		console.error('Error handling webhook update:', error)
	}
}

/**
 * Example webhook endpoint handler (using Express-like syntax)
 */
/*
app.post('/webhook', async (req, res) => {
	// Verify secret token (optional but recommended)
	const secretToken = req.headers['x-telegram-bot-api-secret-token']

	if (secretToken !== 'my-super-secret-token') {
		return res.sendStatus(401)
	}

	await handleWebhookUpdate(req.body)
	res.sendStatus(200)
})
*/

/**
 * Main function to demonstrate the bot
 */
async function main() {
	console.log('Starting Telegram Bot example...')

	// Example chat ID (replace with a real chat ID)
	const _exampleChatId = 123456789

	// 1. Set up webhook (uncomment to use)
	// await setupWebhook()

	// 2. Send various types of messages (uncomment to test)
	// await sendSimpleMessage(exampleChatId)
	// await sendMessageWithInlineKeyboard(exampleChatId)
	// await sendMessageWithReplyKeyboard(exampleChatId)
	// await sendPhotoByUrl(exampleChatId)
	// await sendPhotoWithKeyboard(exampleChatId)

	console.log('Example complete! Check the console for results.')
	console.log('\nTo use this bot:')
	console.log('1. Replace YOUR_BOT_TOKEN with your actual bot token')
	console.log('2. Uncomment the functions you want to test')
	console.log('3. Replace exampleChatId with your Telegram chat ID')
	console.log('4. Run: bun run examples/basic-bot.ts')
}

// Run the example if executed directly
if (import.meta.main) {
	main().catch(console.error)
}

// Export functions for use in other modules
export {
	bot,
	handleWebhookUpdate,
	sendMessageWithInlineKeyboard,
	sendMessageWithReplyKeyboard,
	sendPhotoByUrl,
	sendPhotoWithKeyboard,
	sendSimpleMessage,
	setupWebhook,
}
