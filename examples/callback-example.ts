/**
 * Callback Query Example
 *
 * This example demonstrates how to handle callback queries from inline keyboard buttons.
 * It includes real-world examples based on actual Telegram callback query payloads.
 *
 * @example Use cases covered:
 * - Vehicle selection system
 * - Multi-step workflows
 * - Dynamic inline keyboards
 * - Callback data parsing
 */

import {
	TelegramBot,
	type CallbackQuery,
	type Update,
	UpdateSchema,
} from '../src'

// Initialize bot
const bot = new TelegramBot({
	botToken: process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN',
})

/**
 * Example 1: Simple button callbacks
 * This shows basic yes/no or action buttons
 */
export async function sendSimpleButtons(chatId: number) {
	await bot.sendMessage({
		chat_id: chatId,
		text: '¿Te gusta esta biblioteca?',
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
}

/**
 * Example 2: List selection with dynamic data
 * This demonstrates a common pattern: showing a list where each item has a callback
 */
export async function sendVehicleList(chatId: number) {
	// In a real app, this would come from a database
	const vehicles = [
		{ id: 1, name: 'TEST', number: '001' },
		{ id: 2, name: 'Camión', number: '002' },
		{ id: 3, name: 'Furgoneta', number: '003' },
	]

	await bot.sendMessage({
		chat_id: chatId,
		text: `🚗 Tus vehículos asignados (${vehicles.length}):`,
		reply_markup: {
			inline_keyboard: vehicles.map((vehicle) => [
				{
					text: `🚗 ${vehicle.name} - ${vehicle.number}`,
					callback_data: `vehicle_${vehicle.id}`,
				},
			]),
		},
	})
}

/**
 * Example 3: Vehicle detail view with action buttons
 * This shows a detail view with multiple action options
 */
export async function sendVehicleDetail(chatId: number, vehicleId: number) {
	// In a real app, fetch vehicle details from database
	const vehicle = {
		id: vehicleId,
		name: 'TEST',
		number: '001',
		status: 'Activo',
	}

	await bot.sendMessage({
		chat_id: chatId,
		text: `🚗 Vehículo ${vehicle.name}\n\n📋 Número interno: ${vehicle.number}\n✅ Estado: ${vehicle.status}`,
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
						text: '📊 Ver historial',
						callback_data: `history_${vehicleId}`,
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
}

/**
 * Example 4: Multi-step workflow with callbacks
 * This demonstrates a checklist or wizard-style interface
 */
export async function sendChecklistStart(chatId: number, vehicleId: number) {
	const checklist = [
		{ id: 'tires', label: 'Neumáticos', done: false },
		{ id: 'lights', label: 'Luces', done: false },
		{ id: 'brakes', label: 'Frenos', done: false },
		{ id: 'fluids', label: 'Fluidos', done: false },
	]

	const keyboard = checklist.map((item) => [
		{
			text: `${item.done ? '✅' : '⬜'} ${item.label}`,
			callback_data: `check_item_${vehicleId}_${item.id}`,
		},
	])

	keyboard.push([
		{
			text: '🔙 Cancelar',
			callback_data: `vehicle_${vehicleId}`,
		},
		{
			text: '✅ Finalizar',
			callback_data: `check_complete_${vehicleId}`,
		},
	])

	await bot.sendMessage({
		chat_id: chatId,
		text: '📋 Chequeo Preoperacional\n\nSelecciona cada ítem para marcarlo:',
		reply_markup: {
			inline_keyboard: keyboard,
		},
	})
}

/**
 * Main callback query handler
 * This processes all callback queries and routes them to appropriate handlers
 */
export async function handleCallbackQuery(update: Update) {
	const query = update.callback_query
	if (!query?.data) return

	const chatId = query.message?.chat.id
	if (!chatId) return

	// Log the callback for debugging
	console.log('📞 Callback received:', {
		id: query.id,
		data: query.data,
		user: query.from.username || query.from.first_name,
		chat_instance: query.chat_instance,
	})

	// Parse callback data and route to appropriate handler
	try {
		await routeCallback(query, chatId)
	} catch (error) {
		console.error('Error handling callback:', error)
		await bot.sendMessage({
			chat_id: chatId,
			text: '❌ Ocurrió un error procesando tu selección. Por favor, intenta nuevamente.',
		})
	}
}

/**
 * Router function that handles different callback patterns
 */
async function routeCallback(query: CallbackQuery, chatId: number) {
	const data = query.data || ''

	// Pattern: vehicle_<id>
	if (data.startsWith('vehicle_')) {
		const vehicleId = parseInt(data.split('_')[1])
		await sendVehicleDetail(chatId, vehicleId)
		return
	}

	// Pattern: check_<vehicleId>
	if (data.startsWith('check_') && !data.includes('item') && !data.includes('complete')) {
		const vehicleId = parseInt(data.split('_')[1])
		await sendChecklistStart(chatId, vehicleId)
		return
	}

	// Pattern: check_item_<vehicleId>_<itemId>
	if (data.startsWith('check_item_')) {
		const [, , vehicleId, itemId] = data.split('_')
		await handleChecklistItem(chatId, parseInt(vehicleId), itemId)
		return
	}

	// Pattern: check_complete_<vehicleId>
	if (data.startsWith('check_complete_')) {
		const vehicleId = parseInt(data.split('_')[2])
		await handleChecklistComplete(chatId, vehicleId)
		return
	}

	// Pattern: history_<vehicleId>
	if (data.startsWith('history_')) {
		const vehicleId = parseInt(data.split('_')[1])
		await bot.sendMessage({
			chat_id: chatId,
			text: `📊 Historial del vehículo ${vehicleId}\n\n(Esta función está en desarrollo)`,
		})
		return
	}

	// Exact match: list_vehicles
	if (data === 'list_vehicles') {
		await sendVehicleList(chatId)
		return
	}

	// Simple callbacks
	const simpleCallbacks: Record<string, string> = {
		like: '¡Me alegra que te guste! 👍',
		dislike: 'Entendido, tomaré nota 👎',
		info: '💡 telegram-api-fetch\n\n' +
			'Biblioteca TypeScript para Telegram Bot API con:\n' +
			'✅ Validación Zod completa\n' +
			'✅ Tipos TypeScript autogenerados\n' +
			'✅ Soporte para webhooks y callbacks\n' +
			'✅ Cliente API completo',
	}

	if (data in simpleCallbacks) {
		await bot.sendMessage({
			chat_id: chatId,
			text: simpleCallbacks[data],
		})
		return
	}

	// Default: unknown callback
	console.warn('Unknown callback data:', data)
	await bot.sendMessage({
		chat_id: chatId,
		text: `Callback recibido: ${data}`,
	})
}

/**
 * Handle checklist item toggle
 * In a real app, you would update the database and refresh the message
 */
async function handleChecklistItem(
	chatId: number,
	vehicleId: number,
	itemId: string,
) {
	// Here you would:
	// 1. Update the item state in your database
	// 2. Edit the message to show the updated checklist
	// For this example, we'll just show a confirmation

	await bot.sendMessage({
		chat_id: chatId,
		text: `✅ Item "${itemId}" actualizado`,
	})

	// Refresh the checklist (in a real app, use editMessageText)
	await sendChecklistStart(chatId, vehicleId)
}

/**
 * Handle checklist completion
 */
async function handleChecklistComplete(chatId: number, vehicleId: number) {
	await bot.sendMessage({
		chat_id: chatId,
		text: `✅ Chequeo preoperacional completado para vehículo ${vehicleId}\n\n` +
			'El reporte ha sido guardado exitosamente.',
	})

	// Return to vehicle detail
	await sendVehicleDetail(chatId, vehicleId)
}

/**
 * Example webhook handler for Express/Fastify
 */
export function createCallbackWebhookHandler() {
	return async (req: unknown, res: unknown) => {
		try {
			// Validate the update with Zod
			const update = UpdateSchema.parse((req as { body: unknown }).body)

			// Handle callback queries
			if (update.callback_query) {
				await handleCallbackQuery(update)
			}

			// Handle commands that show buttons
			if (update.message?.text?.startsWith('/')) {
				const chatId = update.message.chat.id
				const command = update.message.text

				switch (command) {
					case '/start':
					case '/buttons':
						await sendSimpleButtons(chatId)
						break
					case '/vehicles':
						await sendVehicleList(chatId)
						break
					default:
						await bot.sendMessage({
							chat_id: chatId,
							text: 'Comandos disponibles:\n/buttons - Botones simples\n/vehicles - Lista de vehículos',
						})
				}
			}

			; (res as { sendStatus: (status: number) => void }).sendStatus(200)
		} catch (error) {
			console.error('Error handling webhook:', error)
				; (res as { sendStatus: (status: number) => void }).sendStatus(500)
		}
	}
}

/**
 * Test the callback system
 * Run this to test callbacks in your chat
 */
export async function testCallbacks(chatId: number) {
	console.log('🧪 Testing callback system...')

	// Test 1: Simple buttons
	console.log('Test 1: Simple buttons')
	await sendSimpleButtons(chatId)

	// Wait a bit between messages
	await new Promise((resolve) => setTimeout(resolve, 1000))

	// Test 2: Vehicle list
	console.log('Test 2: Vehicle list')
	await sendVehicleList(chatId)

	console.log('✅ Tests sent! Click the buttons to test callbacks.')
}

/**
 * Example: Type-safe callback data handling
 * This shows how to use TypeScript to ensure type safety in callbacks
 */
type CallbackData =
	| { type: 'vehicle'; id: number }
	| { type: 'check'; vehicleId: number }
	| { type: 'check_item'; vehicleId: number; itemId: string }
	| { type: 'simple'; action: 'like' | 'dislike' | 'info' }

/**
 * Parse callback data into a type-safe object
 */
export function parseCallbackData(data: string): CallbackData | null {
	if (data.startsWith('vehicle_')) {
		return { type: 'vehicle', id: parseInt(data.split('_')[1]) }
	}
	if (data.startsWith('check_item_')) {
		const [, , vehicleId, itemId] = data.split('_')
		return { type: 'check_item', vehicleId: parseInt(vehicleId), itemId }
	}
	if (data.startsWith('check_')) {
		return { type: 'check', vehicleId: parseInt(data.split('_')[1]) }
	}
	if (['like', 'dislike', 'info'].includes(data)) {
		return { type: 'simple', action: data as 'like' | 'dislike' | 'info' }
	}
	return null
}

// Export the bot instance for testing
export { bot }
