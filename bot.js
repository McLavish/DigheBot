const Telegraf = require('telegraf')
const token = '1121703110:AAGRSBYRz_rKiP676BZqIvqLDJLkQu7P4OY'
const bot = new Telegraf(token)
const axios = require('axios')

bot.start((ctx) => ctx.reply('Avviato'))

bot.command('last', async (context) => {
    var url = 'https://api.thingspeak.com/channels/1011882/feeds.json';
    let text = context.message.text
    let id = "-1"
    if (text.split(' ').length > 1) {
        id = text.split(' ')[1]
        let ok = id.split('').filter(char => !'0123456789'.includes(char)).length === 0
        if (!ok) {
            context.reply('Inserisci un id numerico')
            return
        }
    }
    let feeds
    try {
        let result = (await axios.get(url))
        feeds = result.data.feeds
    } catch {
        context.reply("Errore durante l'esecuzione della richiesta")
        return
    }
    feeds.sort((a, b) => a.created_at - b.created_at)
    if (id === "-1") {
        context.reply("Ultima misurazione generale: " + feeds[feeds.length - 1].field1)
        return
    }
    let search = feeds.filter(feed => feed.field2 === id)
    if (search.length === 0) {
        context.reply("Non esistono misure per quell'id")
        return
    }
    context.reply("Ultima misurazione: " + search[search.length - 1].field1)
})

bot.startPolling()