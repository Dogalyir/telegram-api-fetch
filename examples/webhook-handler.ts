/**
 * Simple Webhook Handler Example
 *
 * This example shows how to set up a basic webhook handler
 * for receiving and processing Telegram updates.
 */

import { TelegramBot, type Update, UpdateSchema } from '../src'

// Initialize bot
const bot = new TelegramBot({
	botToken: process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN',
})

/**
 * Process incoming webhook updates
 */
export async function handleUpdate(update: Update) {
	console.log('Received update:', update.update_id)

	// Handle text messages
	if (update.message?.text) {
		await handleTextMessage(update)
	}

	// Handle photos
	if (update.message?.photo) {
		await handlePhoto(update)
	}

	// Handle callback queries (button clicks)
	if (update.callback_query) {
		await handleCallbackQuery(update)
	}

	// Handle location
	if (update.message?.location) {
		await handleLocation(update)
	}
}

/**
 * Handle text messages
 */
async function handleTextMessage(update: Update) {
	const message = update.message
	if (!message?.text) return

	const chatId = message.chat.id
	const text = message.text
	const username = message.from?.username || 'Usuario'

	console.log(`Text from @${username}: ${text}`)

	// Handle commands
	if (text.startsWith('/')) {
		await handleCommand(chatId, text)
		return
	}

	// Echo the message
	await bot.sendMessage({
		chat_id: chatId,
		text: `Recibí tu mensaje: "${text}"`,
		reply_to_message_id: message.message_id,
	})
}

/**
 * Handle bot commands
 */
async function handleCommand(chatId: number, command: string) {
	switch (command) {
		case '/start':
			await bot.sendMessage({
				chat_id: chatId,
				text: '¡Bienvenido! Soy un bot de Telegram.\n\nComandos disponibles:\n/help - Mostrar ayuda\n/keyboard - Mostrar teclado\n/photo - Enviar foto',
			})
			break

		case '/help':
			await bot.sendMessage({
				chat_id: chatId,
				text: '🤖 *Ayuda del Bot*\n\n/start - Iniciar bot\n/keyboard - Mostrar teclado inline\n/photo - Enviar una foto de ejemplo',
				parse_mode: 'Markdown',
			})
			break

		case '/keyboard':
			await bot.sendMessage({
				chat_id: chatId,
				text: 'Elige una opción:',
				reply_markup: {
					inline_keyboard: [
						[
							{ text: '👍 Me gusta', callback_data: 'like' },
							{ text: '👎 No me gusta', callback_data: 'dislike' },
						],
						[{ text: '💡 Más información', callback_data: 'info' }],
					],
				},
			})
			break

		case '/photo':
			await bot.sendPhoto({
				chat_id: chatId,
				photo: 'https://telegram.org/img/t_logo.png',
				caption: '¡Aquí está tu foto! 📸',
			})
			break

		default:
			await bot.sendMessage({
				chat_id: chatId,
				text: `Comando desconocido: ${command}\n\nUsa /help para ver los comandos disponibles.`,
			})
	}
}

/**
 * Handle photo messages
 */
async function handlePhoto(update: Update) {
	const message = update.message
	if (!message?.photo) return

	const chatId = message.chat.id
	const largestPhoto = message.photo[message.photo.length - 1]

	console.log('Received photo:', largestPhoto?.file_id)

	await bot.sendMessage({
		chat_id: chatId,
		text: '¡Bonita foto! 📸 Recibí tu imagen correctamente.',
		reply_to_message_id: message.message_id,
	})
}

/**
 * Handle callback queries from inline keyboard buttons
 */
async function handleCallbackQuery(update: Update) {
	const query = update.callback_query
	if (!query?.data) return

	const chatId = query.message?.chat.id
	const _messageId = query.message?.message_id
	if (!chatId) return

	console.log('Callback query:', {
		id: query.id,
		data: query.data,
		from: query.from.username || query.from.first_name,
		chatInstance: query.chat_instance,
	})

	// Process different callback patterns
	let responseText = ''

	// Example: Vehicle selection callbacks (vehicle_1, vehicle_2, etc.)
	if (query.data.startsWith('vehicle_')) {
		const vehicleId = query.data.split('_')[1]
		responseText = `🚗 Vehículo ${vehicleId} seleccionado`

		// You can also edit the original message
		// This demonstrates updating the message that contained the button
		await bot.sendMessage({
			chat_id: chatId,
			text: `🚗 Vehículo TEST\n\n📋 Número interno: ${vehicleId}\n✅ Estado: Activo`,
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: '✅ Realizar chequeo preoperacional',
							callback_data: `check_${vehicleId}`,
						},
					],
					[
						{
							text: '🔙 Volver a vehículos',
							callback_data: 'list_vehicles',
						},
					],
				],
			},
		})
		return
	}

	// Example: Check operation callbacks (check_1, check_2, etc.)
	if (query.data.startsWith('check_')) {
		const vehicleId = query.data.split('_')[1]
		responseText = `✅ Iniciando chequeo preoperacional para vehículo ${vehicleId}...`

		await bot.sendMessage({
			chat_id: chatId,
			text: responseText,
		})
		return
	}

	// Example: List vehicles callback
	if (query.data === 'list_vehicles') {
		await bot.sendMessage({
			chat_id: chatId,
			text: '🚗 Tus vehículos asignados (1):',
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: '🚗 TEST - 001',
							callback_data: 'vehicle_1',
						},
					],
				],
			},
		})
		return
	}

	// Standard callback examples
	switch (query.data) {
		case 'like':
			responseText = '¡Me alegra que te guste! 👍'
			break
		case 'dislike':
			responseText = 'Entendido, tomaré nota 👎'
			break
		case 'info':
			responseText =
				'💡 Este es un bot de ejemplo creado con telegram-api-fetch\n\n' +
				'Características:\n' +
				'✅ Validación con Zod\n' +
				'✅ TypeScript completo\n' +
				'✅ Soporte para callbacks\n' +
				'✅ Teclados inline\n' +
				'✅ Manejo de ubicaciones y fotos'
			break
		default:
			responseText = `Recibí callback: ${query.data}`
	}

	await bot.sendMessage({
		chat_id: chatId,
		text: responseText,
	})

	// Optional: Answer the callback query to remove the loading state
	// Note: This requires implementing answerCallbackQuery in the TelegramBot class
	// await bot.answerCallbackQuery({
	//   callback_query_id: query.id,
	//   text: 'Procesado ✓'
	// })
}

/**
 * Handle location messages
 */
async function handleLocation(update: Update) {
	const message = update.message
	if (!message?.location) return

	const chatId = message.chat.id
	const { latitude, longitude } = message.location

	console.log('Received location:', latitude, longitude)

	await bot.sendMessage({
		chat_id: chatId,
		text: `📍 Recibí tu ubicación:\nLatitud: ${latitude}\nLongitud: ${longitude}`,
		reply_to_message_id: message.message_id,
	})
}

/**
 * Express-like webhook endpoint example
 */
export function createWebhookHandler() {
	return async (req: unknown, res: unknown) => {
		try {
			// Verify secret token (recommended for security)
			const secretToken = (req as { headers: Record<string, string> }).headers[
				'x-telegram-bot-api-secret-token'
			]
			const expectedToken = process.env.TELEGRAM_SECRET_TOKEN

			if (expectedToken && secretToken !== expectedToken) {
				console.warn('Invalid secret token received')
				return (res as { sendStatus: (status: number) => void }).sendStatus(401)
			}

			// Parse and validate the update
			const update = UpdateSchema.parse((req as { body: unknown }).body)

			// Process the update
			await handleUpdate(update)

			;(res as { sendStatus: (status: number) => void }).sendStatus(200)
		} catch (error) {
			console.error('Error handling webhook:', error)
			;(res as { sendStatus: (status: number) => void }).sendStatus(500)
		}
	}
}

/**
 * Example usage with Express
 */
/*
import express from 'express'

const app = express()
app.use(express.json())

// Webhook endpoint
app.post('/webhook', createWebhookHandler())

// Health check
app.get('/health', (req, res) => {
	res.json({ status: 'ok' })
})

app.listen(3000, () => {
	console.log('Webhook server listening on port 3000')
})
*/

export { bot }
