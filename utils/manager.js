const {
    MessageEmbed
} = require('discord.js');
const {
    GiveawaysManager
} = require('discord-giveaways');
const giveawayModel = require("../databases/database/giveaways")
module.exports = async (client) => {

    const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
        async getAllGiveaways() {
            return await giveawayModel.find().lean().exec();
        }

        async saveGiveaway(messageId, giveawayData) {
            await giveawayModel.create(giveawayData);
            return true;
        }

        async editGiveaway(messageId, giveawayData) {
            await giveawayModel.updateOne({ messageId }, giveawayData, { omitUndefined: true }).exec();
            return true;
        }

        async deleteGiveaway(messageId) {
            await giveawayModel.deleteOne({ messageId }).exec();
            return true;
        }

        async refreshStorage() {
            return client.shard.broadcastEval(() =>
                this.giveawaysManager.getAllGiveaways()
            );

        }
        /**
         * @param {Giveaway} giveaway
         */

        generateMainEmbed(giveaway) {
            let mainEmbed = new MessageEmbed()
                .setColor('#fffdde')
                .setTitle(giveaway.prize)
                .setTimestamp(giveaway.endAt)
                .setDescription(`React with 🎉 to enter!\nEnds: <t:${Math.round(giveaway.endAt / 1000)}:R> (<t:${Math.round(giveaway.endAt / 1000)}:f>)\nHosted by: ${giveaway.hostedBy}`)
            if (giveaway.extraData) {
                if (giveaway.extraData.role !== "null") {
                    return mainEmbed.setDescription(`React with 🎉 to enter!\nEnds: <t:${Math.round(giveaway.endAt / 1000)}:R> (<t:${Math.round(giveaway.endAt / 1000)}:f>)\nHosted by: ${giveaway.hostedBy}\nRequired Role: <@&${giveaway.extraData.role}>`)
                }

            }
            return mainEmbed;
        }
        generateEndEmbed(giveaway, winners) {
            let mainEmbed1 = new MessageEmbed()
                .setColor('YELLOW')
                .setTimestamp(giveaway.endAt)
                .setTitle(giveaway.prize)
                .setDescription(`Winners: ${winners}\nHosted by: ${giveaway.hostedBy}`)
            if (giveaway.extraData) {
                if (giveaway.extraData.role !== "null") {
                    return mainEmbed1.setDescription(`Winners: ${winners}\nRequired Role: <@&${giveaway.extraData.role}>\nHosted by: ${giveaway.hostedBy}`)
                }
            }
            return mainEmbed1;
        }
        generateNoValidParticipantsEndEmbed(giveaway) {
            let mainEmbed2 = new MessageEmbed()
                .setColor("RED")
                .setTitle(giveaway.prize)
                .setTimestamp(giveaway.endAt)
                .setDescription(`Not enough entrants to determine a winner!`)
                .addField("Hosted by:", `> ${giveaway.hostedBy}`)

            return mainEmbed2;
        }
    };


    const manager = new GiveawayManagerWithOwnDatabase(client, {
        default: {
            botsCanWin: false,
            embedColor: `#fffdde`,
            embedColorEnd: "WHITE",
            reaction: "🎉",
        },
    });

    client.giveawaysManager = manager;

    client.giveawaysManager.on("giveawayReactionAdded", async (giveaway, reactor, messageReaction) => {
        let client = messageReaction.message.client
        if (reactor.user.bot) return;
        if (giveaway.extraData) {


            if (giveaway.extraData.role !== "null" && !reactor.roles.cache.get(giveaway.extraData.role)) {
                console.log(giveaway.extraData.role)
                messageReaction.users.remove(reactor.user);
            
                return console.log("Failed | 92")

            }
            return console.log("Success | 95")
        } else {
            return console.log("Success | 97")
        }
    });

}

