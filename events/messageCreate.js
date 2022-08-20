const prefix = "x"

//parses text into commands if they start with prefix, dont touch this unless you know what you're doing
module.exports = (client, message, args, member) => {
    if (!message.content.startsWith(prefix) || message.author.bot || !message.guild) return
    args = message.content.slice(prefix.length).split(/ +/)
    const cmd = client.commands.get(args.shift().toLowerCase())
    if (!cmd) return
    cmd.run(client, message, args, member)
}