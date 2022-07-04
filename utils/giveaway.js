const Discord = require("discord.js");
const moment = require("moment");
const ms = require("ms");
const fs = require("fs")
const config = require("../config.json")
const manager = require("./manager");
const os = require('os');

const {
    inspect
} = require(`util`);
const {
    MessageEmbed,
    Client,
    Message,
    MessageActionRow,
    MessageButton
} = require('discord.js');
module.exports = (client) => {

    client.on("messageCreate", async (message) => {

        if (message.guild && !message.author.bot) {
            let serverauthor = message.author;

            const prefixes = await client.db.fetch(`prefix-${message.guild.id}`)

            if (prefixes == null) {
                prefix = 'g!'
            } else {
                prefix = prefixes
            }

            // if (!message.content.startsWith(prefix)) return
            //let prefix = client.settings.get(message.guild.id, `prefix`);
            for (const gid of client.guilds.cache.map(g => g.id)) {
                client.stats.ensure(gid, {
                    giveaways: 0,
                    drops: 0
                })
            }

            let global = client.stats.get("global");
            let guild = client.stats.get(message.guild.id);

            client.stats.ensure("global", {
                giveaways: 0,
                drops: 0
            });

            client.stats.ensure(message.guild.id, {
                giveaways: 0,
                drops: 0
            });


            //--------------------------------//

            //Getting manager role
            const getManagerRole = await client.db.get(`manager-${message.guild.id}`)
            const managerRoleCheck = await client.db.fetch(`manager-${message.guild.id}`)

            let managerRoleStatus

            if (managerRoleCheck) {
                managerRoleStatus = `<@&${getManagerRole}>`
            } else managerRoleStatus = "No manager role found."

            //Getting mention role
            const getMentionRole = await client.db.get(`mention-${message.guild.id}`)
            const mentionRoleCheck = await client.db.fetch(`mention-${message.guild.id}`)

            let mentionRoleStatus

            if (mentionRoleCheck) {
                mentionRoleStatus = `<@&${getMentionRole}>`
            } else mentionRoleStatus = "No mention role found."


            const getPrefix = await client.db.get(`prefix-${message.guild.id}`)
            const prefixCheck = await client.db.fetch(`prefix-${message.guild.id}`)

            let prefixStatus

            if (prefixCheck) {
                prefixStatus = `${getPrefix}`
            } else prefixStatus = "`g!`"

            client.prefixguild = prefixStatus
            client.mentionguild = mentionRoleStatus
            client.managerguild = managerRoleStatus

            //--------------------------------//

            const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
            if (prefixRegex.test(message.content)) {
                const [, matchedPrefix] = message.content.match(prefixRegex);
                let args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
                let cmd = args.shift()?.toLowerCase(); //PinG --> ping;
                if (cmd.length == 0 && matchedPrefix.includes(client.user.id)) {
                    return message.channel.send({
                        embeds: [
                            new Discord.MessageEmbed().setColor("#fffdde").setDescription(`Hey there! 👋\n> My prefix is \`${prefix}\`\n> Type \`${prefix}help\` for commands!`)
                        ]
                    }).catch(console.error);
                }
                if (cmd && cmd.length > 0) {
                    if (cmd == "help") {
                        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS)) {
                            return message.channel.send(`It's seems that i dont have permission to **EMBED LINKS**`)
                        }
                        let btn1 = new MessageButton().setStyle('LINK').setLabel("Support Server").setURL("https://discord.gg/7TAuaQWA8R")
                        let btn2 = new MessageButton().setStyle('LINK').setLabel("Vote").setURL("https://top.gg/bot/927898142207266896/vote")
                        let bnt3 = new MessageButton().setStyle("LINK").setLabel("Invite").setURL(`https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&permissions=347200&scope=bot`)

                        let row = new MessageActionRow()
                            .addComponents([btn1, btn2, bnt3])
                        const row2 = [row]
                        message.channel.send({
                            embeds: [new Discord.MessageEmbed().setColor('#fffdde')
                                .setAuthor({ name: `${client.user.username} HelpDesk`, iconURL: client.user.displayAvatarURL() })
                                .setDescription(`\`\`\`yaml\n<> - Required Argument | [] - Optional Argument\`\`\``)
                                .addField("✉ Information", "`help`, `ping`, `invite`, `about`, `changelog`")
                                .addField("➕ Plugins", "`setprefix`, `setmention`, `setmanager`, `setlang`, `settings`")
                                .addField("🎉 Giveaway", "`start`, `end`, `reroll`, `delete`, `drop (beta)`")
                                .addField("❔ Examples:", `\`${prefix}start <time> <winners> <prize>\`\n\`${prefix}reroll <message-id>\`\n\`${prefix}drop <prize>\``)
                                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                            ], components: row2
                        })
                    }
                    if (cmd == "about") {
                        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS)) {
                            return message.channel.send(`It's seems that i dont have permission to **EMBED LINKS**`)
                        }
                        const cpu = os.cpus()[0];
                        let btn1 = new MessageButton().setStyle('LINK').setLabel("Support Server").setURL("https://discord.gg/7TAuaQWA8R")
                        let btn2 = new MessageButton().setStyle('LINK').setLabel("Vote").setURL("https://top.gg/bot/927898142207266896/vote")
                        let bnt3 = new MessageButton().setStyle("LINK").setLabel("Invite").setURL(`https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&permissions=347200&scope=bot`)

                        let row = new MessageActionRow()
                            .addComponents([btn1, btn2, bnt3])
                        const row2 = [row]
                        message.channel.send({
                            conetent: `🎉 **${client.user.username}**'s About!  🎉`,
                            embeds: [new Discord.MessageEmbed().setColor('#fffdde')
                                .setAuthor({ name: `${client.user.username} About Bot`, iconURL: client.user.displayAvatarURL() })
                                .setDescription(`Hey there! I'm **${client.user.username}**, and I'm here to make it easy possible to hold giveaways on your Discord server!\nI was created by **${client.users.cache.get("741226689589411940").tag}** (<@${client.users.cache.get("741226689589411940").id}>)\nCheck my commands by typing \`${prefix}help\`!`)
                                .addField("🧵 Stats", `\`Guilds :\` ${client.guilds.cache.size}\n\`Users :\` ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}\n\`Shard ${message.guild.shard.id} :\` ${message.guild.shard.ping}ms`)
                                .addField("🎉 Giveaways", `\`Giveaways created :\` ${client.giveawaysManager.giveaways.length}\n\`Drops created :\` ${global.drops}`)
                                .addField("🎐 System", `\`Discord.js :\` v${Discord.version}\n\`Node.js :\` v${process.versions.node}\n\`Speed: \` ${cpu?.speed && os.cpus().length > 1 ? cpu?.speed * os.cpus().length : cpu?.speed} MHz`)
                                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                            ], components: row2
                        })
                    }
                    if (cmd == "ping") {
                        await message.channel.send({ content: `Pong!\n**Shard ${message.guild.shard.id}:** ${message.guild.shard.ping}ms (avg)\n**Websocket:** ${client.ws.ping}ms\n**Message:** ${Date.now() - message.createdTimestamp}ms\n**Client Uptime:** : <t:${(Date.now() / 1000 - client.uptime / 1000).toFixed(0)}:R>` })

                    }

                    if (cmd == "changelog") {
                        await message.channel.send({
                            embeds: [new MessageEmbed()
                                .setColor('#fffdde')
                                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                                .setTitle(`Changelog - v2.2.1`)
                                .addField("Giveaway", `Added requirement role (1).`)
                                .addField("Plugins", `Removed \`setbanner\`.`)
                            ]
                        })

                    }

                    if (cmd == "invite") {
                        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS)) {
                            return message.channel.send(`It's seems that i dont have permission to **EMBED LINKS**`)
                        }
                        await message.channel.send({ content: `🎉 Hey there!\nYou can add me to your server with this link:\n\n> <https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&permissions=347200&scope=bot>\n\nCheck out my commands by typing \`g!help\`` })

                    }

                    if (cmd == "setprefix") {
                        if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) {
                            return
                        }
                        if (!args[0]) {
                            return message.channel.send({ embeds: [new Discord.MessageEmbed().setColor("YELLOW").setDescription(`**Wrong Syntax**\n> \`Usage: prefix <new prefix>\``)] })
                        }
                        if (args[0].length > 3) return message.channel.send({ embeds: [new Discord.MessageEmbed().setColor("YELLOW").setDescription(`> New prefix cannot be longer that 3 letters!`)] })

                        await client.db.set(`prefix-${message.guild.id}`, args[0])
                        return message.channel.send({
                            embeds: [
                                new Discord.MessageEmbed().setColor("#fffdde").setColor(`GREEN`).setDescription(`Changed prefix to \`${args[0]}\``)
                            ]
                        }).catch(console.error);
                    }
                }
                if (cmd == "drop") {
                    if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES) && !message.member.roles.cache.has(client.db.get(`manager-${message.guild.id}`))) {
                        return message.channel.send({
                            embeds: [new MessageEmbed()
                                .setColor("RED")
                                .setDescription(`You don't either have a permission or the manager role to use this command.`)
                            ]
                        })
                    }
                    //create a random 15 digit mixed string
                    const randomID = Math.random().toString(36).substr(2, 20);
                    var ranID = randomID;
                    const randomID2 = Math.random().toString(36).substr(2, 20);
                    var ranID2 = randomID2;
                    //make a new drop
                    let drop = args.slice(0).join(" ");
                    if (!drop) {
                        return message.reply({
                            content: `💥 Please include a drop prize\nExample usage: \`${prefix}drop Nitro\``
                        });
                    }
                    message.delete()
                    const embed = new MessageEmbed()
                        .setTitle("Giveaway Drop!")
                        .setDescription("A drop started!\n> This drop will end after 5 minutes!")
                        .addField("Started by:", `${message.author.tag} (\`${message.author.id}\`)`)
                        .addField("Prize:", `${drop}`)
                        .setColor('#fffdde')
                        .setFooter({ text: `Click the button and win!` })
                        .setTimestamp();

                    const row = new MessageActionRow().addComponents(
                        new MessageButton()
                            .setLabel("Drop")
                            .setEmoji("🎁")
                            .setStyle("SECONDARY")
                            .setCustomId("drop")
                            .setDisabled(false)
                    );
                    let reactMsg = await message.channel.send({
                        embeds: [embed],
                        components: [row],
                    });
                    client.stats.inc(message.guild.id, "drops")
                    client.stats.inc("global", "drops")

                    const collector = await reactMsg.createMessageComponentCollector({
                        componentType: "BUTTON",
                        time: 300000,
                    });

                    collector.on("collect", async (i) => {
                        if (i.customId == "drop") {
                            if (i.user.id == message.author.id) {
                                const embed = new MessageEmbed()
                                    .setDescription(`You cant click this because you are the host`)
                                    .setColor("RED");
                                return i.reply({ embeds: [embed], ephemeral: true });
                            } else {
                                const row = new MessageActionRow().addComponents(
                                    new MessageButton()
                                        .setLabel("Drop")
                                        .setEmoji("🎁")
                                        .setStyle("SUCCESS")
                                        .setCustomId("drop")
                                        .setDisabled(true)
                                );
                                let dropCustom = drop.replace("`", "")
                                const embed = new MessageEmbed()
                                    .setTitle("Giveaway Drop")
                                    .addField("Started by:", `${message.author.tag} (\`${message.author.id}\`)`)
                                    .addField("Prize:", `${dropCustom}`)
                                    .addField("Winner:", `${i.user.tag} (\`${i.user.id}\`)`)
                                    .setTimestamp()
                                    .setColor('#fffdde')
                                await reactMsg
                                    .edit({ embeds: [embed], components: [row] })
                                    .then(() => {
                                        return i.reply({ content: `<@${i.user.id}>`, embeds: [embed], ephemeral: false });
                                    });
                            }
                        }
                    });

                    collector.on("end", (collected) => {
                        const row = new MessageActionRow().addComponents(
                            new MessageButton()
                                .setLabel("Drop")
                                .setEmoji("🎁")
                                .setStyle("SUCCESS")
                                .setCustomId("drop")
                                .setDisabled(true)
                        );
                        reactMsg.edit({ components: [row] });
                    });

                }
                if (cmd == "start") {
                    if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES) && !message.member.roles.cache.has(client.db.get(`manager-${message.guild.id}`))) {
                        return message.channel.send({
                            embeds: [new MessageEmbed()
                                .setColor("RED")
                                .setDescription(`You don't either have a permission or the manager role to use this command.`)
                            ]
                        })
                    }

                    const gchannel = message.channel
                    const giveawayDuration = args[0];
                    const giveawayNumberWinners = args[1] || 1
                    const giveawayReqRole = message.mentions.roles.first() || message.guild.roles.cache.get(args[2])
                    const giveawayPrize = args.slice(3).join(" ");

                    //Getting mention role
                    const getMentionRole = await client.db.get(`mention-${message.guild.id}`)
                    const mentionRoleCheck = await client.db.fetch(`mention-${message.guild.id}`)

                    let mentionRoleStatus

                    if (mentionRoleCheck) {
                        mentionRoleStatus = `<@&${getMentionRole}>`
                    } else mentionRoleStatus = []

                    //Getting manager role


                    const ping = mentionRoleStatus

                    if (!gchannel) return message.reply({
                        content: `💥 Please include a length of time, and optionally a number of winners and a prize!\nExample usage: \`${prefix}start 30m 5 none Nitro Classic\``
                    });

                    if (!giveawayDuration) return message.reply({
                        content: `💥 Please include a length of time, and optionally a number of winners and a prize!\nExample usage: \`${prefix}start 30m 5 none Nitro Classic\``
                    });

                    if (!giveawayDuration) return message.reply({
                        content: `💥 Please include a length of time, and optionally a number of winners and a prize!\nExample usage: \`${prefix}start 30m 5 none Nitro Classic\``
                    });
                    if (!(ms(giveawayDuration))) return message.reply({
                        content: `💥 Failed to parse time from \`${giveawayDuration}\``
                    });

                    if (!giveawayNumberWinners) return message.reply({
                        content: `💥 Please include a number of winners and a prize!\nExample usage: \`${prefix}start 30m 5 none Nitro Classic\``
                    });

                    if (isNaN(giveawayNumberWinners)) return message.reply({
                        content: `💥 Failed to parse numbers from \`${giveawayNumberWinners}\``
                    });
                    /* if (!giveawayReqRole) return message.reply({
                         content: `💥 You must include a giveaway role requirement.\nExample usage: \`${prefix}start 30m 5 970661729296068659 Nitro Classic\`\nWithout Req: \`${prefix}start 30m 5 none Nitro Classic\``
                     }); */
                    if (!giveawayPrize) return message.reply({
                        content: `💥 Please include a giveaway prize\nExample usage: \`${prefix}start 30m 5 none Nitro Classic\``
                    });

                    if (ms(giveawayDuration) > ms("31d")) return message.reply({
                        content: `💥 Giveaway time must not be longer than **1 month**`
                    });

                    client.giveawaysManager.start(message.channel, {
                        prize: giveawayPrize,
                        duration: ms(giveawayDuration),
                        winnerCount: parseInt(giveawayNumberWinners),
                        hostedBy: message.member,
                        messages: {
                            giveaway: `${ping}\n<:zp_confetti:972073310894583828> **GIVEAWAY** <:zp_confetti:972073310894583828>`,
                            giveawayEnded: "> <:zp_confetti:972073310894583828> **GIVEAWAY ENDED** <:zp_confetti:972073310894583828>",
                            // drawing: "Drawing: {timestamp}",
                            // dropMessage: "Be the first to react with 🎉 !",
                            // inviteToParticipate: "React with 🎉 to participate!",
                            winMessage: {
                                embed: { color: "#fffdde", description: `[🔗 \`Giveaway Link\`]({this.messageURL})` },
                                content: `Congratulations {winners}! You won the **{this.prize}**!`
                            },
                            // embedFooter: "{this.winnerCount} winner(s)",
                            // noWinner: "Giveaway cancelled, no valid participations.",
                            // hostedBy: "Hosted by: {this.hostedBy}",
                            //winners: "Winner(s):",
                            //endedAt: "Ended at",
                        }, extraData: {
                            role: giveawayReqRole == null ? "null" : giveawayReqRole.id,
                        },
                    }).then((s) => {

                        message.delete()
                        client.stats.inc(message.guild.id, "giveaways")
                        client.stats.inc("global", "giveaways")
                    })
                }
                if (cmd == "reroll") {
                    if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES) && !message.member.roles.cache.has(client.db.get(`manager-${message.guild.id}`))) {
                        return message.channel.send({
                            embeds: [new MessageEmbed()
                                .setColor("RED")
                                .setDescription(`You don't either have a permission or the manager role to use this command.`)
                            ]
                        })
                    }
                    let messageId = args[0]
                    if (!messageId) return message.channel.send({ content: `💥 Please include a valid giveaway message id!\nUsage: \`${prefix}reroll 975955787195248660\`` })

                    const amount = args[1] || 1
                    const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === message.guildId && g.messageId === messageId);
                    if (!giveaway) {
                        return message.reply({ content: `💥 This giveaway message id is invalid!` });
                    }

                    client.giveawaysManager.reroll(messageId, {
                        winnerCount: !isNaN(amount) ? Number(amount) : 1,
                        messages: {
                            congrat: `The new winner is {winners}! Congratulations`,
                            error: `No valid participations, no new winner(s) can be chossen!`
                        }
                    }).then(() => {
                        return message.react("👌")
                    }).catch((err) => {
                        return
                    });

                }
                if (cmd == "end") {
                    if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES) && !message.member.roles.cache.has(client.db.get(`manager-${message.guild.id}`))) {
                        return message.channel.send({
                            embeds: [new MessageEmbed()
                                .setColor("RED")
                                .setDescription(`You don't either have a permission or the manager role to use this command.`)
                            ]
                        })
                    }
                    let messageId = args[0]
                    if (!messageId) return message.channel.send({ content: `💥 Please include a valid giveaway message id!\nUsage: \`${prefix}end 975955787195248660\`` })

                    const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === message.guildId && g.messageId === messageId);
                    if (!giveaway) {
                        return message.reply({ content: `💥 This giveaway message id is invalid!` });
                    }

                    client.giveawaysManager.end(messageId).then(() => {
                        return message.react("🎉")
                    }).catch((err) => {
                        return
                    });

                }
                if (cmd == "delete") {
                    if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES) && !message.member.roles.cache.has(client.db.get(`manager-${message.guild.id}`))) {
                        return message.channel.send({
                            embeds: [new MessageEmbed()
                                .setColor("RED")
                                .setDescription(`You don't either have a permission or the manager role to use this command.`)
                            ]
                        })
                    }
                    let messageId = args[0]
                    if (!messageId) return message.channel.send({ content: `💥 Please include a valid giveaway message id!\nUsage: \`${prefix}end 975955787195248660\`` })

                    const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === message.guildId && g.messageId === messageId);
                    if (!giveaway) {
                        return message.reply({ content: `💥 This giveaway message id is invalid!` });
                    }

                    client.giveawaysManager.delete(messageId).then(() => {
                        return message.react("👍")
                    }).catch((err) => {
                        return
                    });

                }

                if (cmd == "setmanager") {
                    if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) {
                        return
                    }
                    if (!args[0]) return message.channel.send({ embeds: [new MessageEmbed().setColor("RED").setDescription("You must provide an argument.\n> `set` - `reset`")] })

                    if (args[0] === "set") {

                        const manager = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])

                        if (!manager) return message.channel.send({ content: `💥 Please include a role to set as giveaway manager\nUsage: \`${prefix}setmanager set <@role/ID>\`` })


                        let saved = client.db.set(`manager-${message.guild.id}`, manager.id);
                        //console.log(saved)
                        message.channel.send({
                            embeds: [
                                new Discord.MessageEmbed().setColor("#fffdde").setDescription(`Set the giveaway manager role to ${manager}`)
                            ]
                        })
                    }
                    if (args[0] === "reset") {
                        client.db.delete(`manager-${message.guild.id}`);
                        message.channel.send({
                            embeds: [
                                new Discord.MessageEmbed().setColor(`#fffdde`).setDescription(`Deleted successfully!`)
                            ]
                        })
                    }
                }
                if (cmd == "setmention") {
                    if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) {
                        return
                    }

                    if (!args[0]) return message.channel.send({ embeds: [new MessageEmbed().setColor("RED").setDescription("You must provide an argument.\n> `set` - `reset`")] })

                    if (args[0] === "set") {
                        const mention = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])

                        if (!mention) return message.channel.send({ content: `💥 Please include a role to set as giveaway mention\nUsage: \`${prefix}setmention set <@role/ID>\`` })


                        let saved = client.db.set(`mention-${message.guild.id}`, mention.id);
                        //console.log(saved)
                        message.channel.send({
                            embeds: [
                                new Discord.MessageEmbed().setColor("#fffdde").setDescription(`Set the giveaway mention role to ${mention}`)
                            ]
                        })
                    }
                    if (args[0] === "reset") {
                        client.db.delete(`mention-${message.guild.id}`);
                        message.channel.send({
                            embeds: [
                                new Discord.MessageEmbed().setColor(`#fffdde`).setDescription(`Deleted successfully!`)
                            ]
                        })
                    }
                }


                if (cmd == "settings") {
                    if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) {
                        return
                    }

                    message.channel.send({
                        embeds: [
                            new Discord.MessageEmbed().setColor("#fffdde")
                                .addField("Manager role:", `> ${client.managerguild}`)
                                .addField("Mention role:", `> ${client.mentionguild}`)
                                .addField("Prefix:", `> \`${client.prefixguild}\``)
                        ]
                    })

                }
                if (cmd == "setlang") {
                    if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) {
                        return
                    }
                    return message.channel.send({
                        embeds: [
                            new Discord.MessageEmbed().setColor("#fffdde").setDescription(`🙈 You've seen this command too early!\nThis command isn't ready yet but we will gonna work for this command!`)
                        ]
                    })

                }
            }
        }
    })

}


function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}