const utils = {
    log: (msg) => {
        console.log(`[SOTERIA] ${msg}`)
    },
    fetchAll: async(channel, limit = 10000) => {
        const allMessages = []
        let options = { limit: 100 }
        let last_id
        module.exports.log(`Fetching messages in ${channel.name}`)
        while (true) {
            if (last_id) {
                options.before = last_id
            }
            const fetched = await channel.messages.fetch(options)
            allMessages.push(...fetched)
            if (fetched.size != 100 || allMessages.length >= limit) break
            last_id = fetched.last().id
        }
        module.exports.log(`Fetched ${allMessages.length} messages in ${channel.name}`)
        return allMessages
    }
}

module.exports = utils