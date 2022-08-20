const { Client, Collection, IntentsBitField } = require("discord.js")
const fs = require("fs")
const intents = new IntentsBitField()
intents.add(IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildMembers)
const client = new Client({ intents })

client.commands = new Collection()

fs.readdir('./events/', (err, files) => {
    if (err) return console.error
    files.forEach(file => {
        if (!file.endsWith('.js')) return
        const evt = require(`./events/${file}`)
        let evtName = file.split('.')[0]
        client.on(evtName, evt.bind(null, client))
    })
})

fs.readdir('./commands/', (err, files) => {
    if (err) return console.error
    files.forEach(file => {
        if (!file.endsWith('.js')) return
        let props = require(`./commands/${file}`)
        let cmdName = file.split('.')[0]
        client.commands.set(cmdName, props)
    })
})

client.login("MTAwOTk4ODk0NjA1NjQ1NDE3NQ.GbgtGT.fU7egE-jrtNJDAZU1siK_vniuSvd7UPFcyszQA")