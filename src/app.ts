import 'dotenv/config'
import { createBot } from '@builderbot/bot'
import { adapterProvider } from './provider'
import { adapterDB } from './databse'
import { adapterFlow } from './flows'
import envConfig from './config/env.config'
import { OpenAIService } from './services/openai'

/** Puerto en el que se ejecutará el servidor */
const PORT = envConfig.port ?? 3000;

/** Instancia de la clase AI */
const openai = new OpenAIService(envConfig.openaiApiKey, 'gpt-3.5-turbo')

const main = async () => {
    
    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    }, { extensions: { openai } })

    /**
     * Ruta POST para enviar mensajes
     * @param {string} number - Número de teléfono del destinatario
     * @param {string} message - Mensaje a enviar
     * @param {string} [urlMedia] - URL del archivo multimedia (opcional)
     */
    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    /**
     * Ruta POST para registrar un nuevo usuario
     * @param {string} number - Número de teléfono del usuario
     * @param {string} name - Nombre del usuario
     */
    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    /**
     * Ruta POST para gestionar la lista negra
     * @param {string} number - Número de teléfono a añadir o eliminar de la lista negra
     * @param {('add'|'remove')} intent - Acción a realizar (añadir o eliminar)
     */
    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

    /** Inicia el servidor HTTP en el puerto especificado */
    httpServer(+PORT);

}

main()
