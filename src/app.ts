import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'

const PORT = process.env.PORT ?? 3008

const discordFlow = addKeyword<Provider, Database>('doc').addAnswer(
    ['You can see the documentation here', '📄 https://builderbot.app/docs \n', 'Do you want to continue? *yes*'].join(
        '\n'
    ),
    { capture: true },
    async (ctx, { gotoFlow, flowDynamic }) => {
        if (ctx.body.toLocaleLowerCase().includes('yes')) {
            return gotoFlow(registerFlow)
        }
        await flowDynamic('Thanks!')
        return
    }
)

// Sub-flujos de Información
const textoInformacionFlow = addKeyword<Provider, Database>('texto_informacion')
    .addAnswer('📄 Aquí puedes agregar un breve texto sobre nuestro negocio:')
    .addAnswer('Esto ayudará a las personas a conocer en detalle tu proposito u objetivo comercial.');

const imagenInformacionFlow = addKeyword<Provider, Database>('imagen_informacion')
    .addAnswer('🖼️ Aquí tienes una imagen sobre nuestros productos:', { media: join(process.cwd(), 'assets', 'sample.png') });

const videoInformacionFlow = addKeyword<Provider, Database>('video_informacion')
    .addAnswer('🎥 Aquí tienes un video sobre nuestros servicios:', { media: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTJ0ZGdjd2syeXAwMjQ4aWdkcW04OWlqcXI3Ynh1ODkwZ25zZWZ1dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LCohAb657pSdHv0Q5h/giphy.mp4' });

const enlacesInformacionFlow = addKeyword<Provider, Database>('enlaces_informacion')
    .addAnswer('🔗 Aquí tienes algunos enlaces útiles para aprender más sobre nosotros:')
    .addAnswer('🌐 Nuestro Sitio Web: https://www.nuestrositioweb.com')
    .addAnswer('📺 Nuestro Canal de YouTube: https://www.youtube.com/nuestrocanal');

// Flujo de Información
const informacionFlow = addKeyword<Provider, Database>(['informacion'])
    .addAnswer('📚 Has seleccionado *Información*. Puedo proporcionarte valiosa información sobre nuestro negocio.')
    .addAnswer([
        'Aquí tienes algunas opciones para aprender más sobre nosotros:',
        '1️⃣ Texto sobre nuestro negocio',
        '2️⃣ Imagen sobre nuestros productos',
        '3️⃣ Video sobre nuestros servicios',
        '4️⃣ Enlaces útiles',
        '🔙 Volver al menú principal (escribe "menu")',
        '',
        'Por favor, selecciona una opción (1, 2, 3, 4 o "menu"):'
    ].join('\n'), { delay: 800, capture: true },
    async (ctx, { fallBack, gotoFlow }) => {
        const option = ctx.body.trim().toLowerCase();
        console.log('Opción seleccionada:', option); // Para depuración
        switch (option) {
            case '1':
                return gotoFlow(textoInformacionFlow);
            case '2':
                return gotoFlow(imagenInformacionFlow);
            case '3':
                return gotoFlow(videoInformacionFlow);
            case '4':
                return gotoFlow(enlacesInformacionFlow);
            case 'menu':
                return gotoFlow(welcomeFlow);
            default:
                return fallBack('Por favor, selecciona una opción válida (1, 2, 3, 4 o "menu")');
        }
    });
// Sub-flujos de Información
const proseruno = addKeyword<Provider, Database>('proseruno_productos')
    .addAnswer('🖼️ *Producto o servicio uno*:', { media: join(process.cwd(), 'assets', 'imagen2.png') }) // Primera imagen
    .addAnswer([
        '🔖 *Precio:* $54 USD',
        '✅ *Disponibilidad:* Cupos disponibles',
        '🔗 *Compra ahora:* [Haga clic aquí](http://cxproexe.site)',
    ].join('\n\n'));

const proserdos = addKeyword<Provider, Database>('proserdos_productos')
.addAnswer('🖼️ *Producto o servicio dos*:', { media: join(process.cwd(), 'assets', 'imagen1.png') }) // Primera imagen
.addAnswer([
    '🔖 *Precio:* $55 USD',
    '✅ *Disponibilidad:* Cupos disponibles',
    '🔗 *Compra ahora:* [Haga clic aquí](http://cxproexe.site)',
].join('\n\n'));
// Otros flujos de ejemplo
const productosFlow = addKeyword<Provider, Database>('productos')
    .addAnswer('Has seleccionado Productos. Aquí tienes nuestra lista de productos...')
    .addAnswer([
        'Productos o servicios disponibles:',
        '1️⃣ Producto o servicio uno',
        '2️⃣ Producto o servicio dos',
        '🔙 Volver al menú principal (escribe "menu")',
        '',
        'Por favor, selecciona una opción (1, 2 o "menu"):'
    ].join('\n'), { delay: 800, capture: true },
    async (ctx, { fallBack, gotoFlow }) => {
        const option = ctx.body.trim().toLowerCase();
        console.log('Opción seleccionada:', option); // Para depuración
        switch (option) {
            case '1':
                return gotoFlow(proseruno);
            case '2':
                return gotoFlow(proserdos);
            case 'menu':
                return gotoFlow(welcomeFlow);
            default:
                return fallBack('Por favor, selecciona una opción válida (1, 2 o "menu")');
        }
    });

const dialunes = addKeyword<Provider, Database>('dialunes_agendarcita')
    .addAnswer('⏰✅ Genial, agendaré tu cita para el dia Lunes a las 10 am')

const diamartes = addKeyword<Provider, Database>('diamartes_agendarcita')
    .addAnswer('⏰✅ Genial, agendaré tu cita para el dia Martes a las 2:00 PM')

const diamiercoles = addKeyword<Provider, Database>('diamiercoles_agendarcita')
    .addAnswer('⏰✅ Genial, agendaré tu cita para el dia Miércoles a las 11:00 AM')

// Flujo para agendar citas
const agendarCitaFlow = addKeyword<Provider, Database>('agendar cita')
    .addAnswer('🗓️ Has seleccionado *Agendar cita*.')
    .addAnswer([
        '📅 En este asistente, puedes agendar una cita según tu disponibilidad.',
        '',
        'Utilizamos las herramientas de *Google Calendar* y *Google Sheets* para gestionar los horarios disponibles. Aquí te explicamos cómo funciona:',
        '1. Te mostraremos los horarios y días disponibles según nuestra configuración.',
        '2. Si seleccionas un horario que ya está ocupado, te avisaremos para que elijas otro día y hora.',
        '3. Podemos crear una cuenta única para utilizar en este asistente y gestionar las citas.',
        '',
        'A continuación, te mostramos un ejemplo de horarios disponibles:'
    ].join('\n\n'))
    .addAnswer([
        'Horarios Disponibles', 
        '1️⃣ Lunes a las 10:00 AM',
        '2️⃣ Martes a las 2:00 PM',
        '3️⃣ Miércoles a las 11:00 AM',
      
        'Por favor, selecciona una opción (1, 2, 3 o "menu"):'
    ].join('\n'), { delay: 800, capture: true },
    async (ctx, { fallBack, gotoFlow }) => {
        const option = ctx.body.trim().toLowerCase();
        console.log('Opción seleccionada:', option); // Para depuración
        switch (option) {
            case '1':
                return gotoFlow(dialunes);
            case '2':
                return gotoFlow(diamartes);
            case '3':
                return gotoFlow(diamiercoles);
            default:
                return fallBack('Por favor, selecciona una opción válida (1, 2 o "menu")');
        }
    });


const hablarRepresentanteFlow = addKeyword<Provider, Database>('hablar con un representante')
    .addAnswer('Has seleccionado *Hablar con un representante*. Un momento por favor...')
    .addAnswer('🔔 Estamos notificando a un representante para que te atienda.')

const welcomeFlow = addKeyword<Provider, Database>(['hola bot', 'menu'])
    .addAnswer('🙌 Hola Bienvenid@ al asistente virtual *Chatex*')
    .addAnswer([
        'Puedo ayudarte a mostrar lo siguiente:',
        '1️⃣ Información',
        '2️⃣ Productos',
        '3️⃣ Agendar cita',
        '4️⃣ Hablar con un representante',
        '',
        'Por favor, elige una opción (1, 2, 3, o 4):'
    ].join('\n'), { delay: 800, capture: true },
    async (ctx, { fallBack, gotoFlow }) => {
        const option = ctx.body.trim();
        switch (option) {
            case '1':
                return gotoFlow(informacionFlow);
            case '2':
                return gotoFlow(productosFlow);
            case '3':
                return gotoFlow(agendarCitaFlow);
            case '4':
                return gotoFlow(hablarRepresentanteFlow);
            default:
                return fallBack('Por favor, selecciona una opción válida (1, 2, 3, o 4)');
        }
    });

// Exporta los flujos si es necesario
export { welcomeFlow, informacionFlow, productosFlow, agendarCitaFlow, hablarRepresentanteFlow, textoInformacionFlow, imagenInformacionFlow, videoInformacionFlow, enlacesInformacionFlow };

const registerFlow = addKeyword<Provider, Database>(utils.setEvent('REGISTER_FLOW'))
    .addAnswer(`What is your name?`, { capture: true }, async (ctx, { state }) => {
        await state.update({ name: ctx.body })
    })
    .addAnswer('What is your age?', { capture: true }, async (ctx, { state }) => {
        await state.update({ age: ctx.body })
    })
    .addAction(async (_, { flowDynamic, state }) => {
        await flowDynamic(`${state.get('name')}, thanks for your information!: Your age: ${state.get('age')}`)
    })

const fullSamplesFlow = addKeyword<Provider, Database>(['samples', utils.setEvent('SAMPLES')])
    .addAnswer(`💪 I'll send you a lot files...`)
    .addAnswer(`Send image from Local`, { media: join(process.cwd(), 'assets', 'sample.png') })
    .addAnswer(`Send video from URL`, {
        media: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTJ0ZGdjd2syeXAwMjQ4aWdkcW04OWlqcXI3Ynh1ODkwZ25zZWZ1dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LCohAb657pSdHv0Q5h/giphy.mp4',
    })
    .addAnswer(`Send audio from URL`, { media: 'https://cdn.freesound.org/previews/728/728142_11861866-lq.mp3' })
    .addAnswer(`Send file from URL`, {
        media: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    })

const main = async () => {
    const adapterFlow = createFlow([welcomeFlow, registerFlow, fullSamplesFlow, informacionFlow, productosFlow, agendarCitaFlow ])
    
    const adapterProvider = createProvider(Provider)
    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

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

    httpServer(+PORT)
}

main()
