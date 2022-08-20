const colors = require("../library/colors.js")
const Discord = require("discord.js")

exports.run = (client, message, args) => { //required in every file
    //when someone runs our command, it all starts inside of here
    if (args[0]) { //someone elses info
        client.users.fetch(args[0]).then(user => {
            message.channel.send({
                embeds: [new Discord.EmbedBuilder()
                    .setTitle(`${user.tag}'s info`)
                    .setColor(colors.Magenta)
                    .setDescription(`Created at: ${user.createdAt}`)
                    .setThumbnail(user.avatarURL())
                ]
            })
        }).catch(err => {
            message.channel.send(err)
        })
    } else { //our info
        message.channel.send({
            embeds: [new Discord.EmbedBuilder()
                .setTitle(`${message.author.tag}'s info`)
                .setColor(colors.Magenta)
                .setDescription(`Created at: ${message.author.createdAt}`)
                .setThumbnail(message.author.avatarURL())
            ]
        })
    }

    console.log(message.channel)
        // console.log(message.channel.messages.cache)
}