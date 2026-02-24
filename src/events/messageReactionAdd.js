const { Events } = require('discord.js');

const TARGET_CHANNEL_ID = '1467969230656770131'; // Replace with your contest channel ID

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user) {
        // Fetch partials
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the reaction:', error);
                return;
            }
        }
        if (user.bot) return;

        // Vote Limiting Logic
        if (reaction.message.channel.id === TARGET_CHANNEL_ID) {
            const channel = reaction.message.channel;
            const reactingUser = await user.fetch();

            try {
                const messages = await channel.messages.fetch();
                let userReactionCount = 0;

                for (const message of messages.values()) {
                    const reactions = message.reactions.cache;
                    for (const r of reactions.values()) {
                        const users = await r.users.fetch();
                        if (users.has(reactingUser.id)) {
                            userReactionCount++;
                        }
                    }
                }
                
                if (userReactionCount > 3) {
                    await reaction.users.remove(reactingUser.id);
                    try {
                        await reactingUser.send("You have reached your maximum of 3 votes. Please un-react to an image if you wish to vote for a different one.");
                    } catch (dmError) {
                        console.error(`Could not send DM to ${reactingUser.tag}.`, dmError);
                    }
                }
            } catch (error) {
                console.error('Failed to process reaction for vote limiting:', error);
            }
            return; // End execution here for the contest channel
        }

        // Existing Role-Reaction Logic
        if (reaction.message.id !== process.env.ROLE_MESSAGE_ID) return;

        const member = await reaction.message.guild.members.fetch(user.id);

        const roleMap = {
            '🪃': '1468583831777972378',
            '❄️': '1468583927064301649',
            '🌿': '1468583980646535199',
            '⚔️': '1468584036837490763',
            '🌪️': '1468584096455196693',
            '🏹': '1468584143343321205',
            '🛡️': '1468584180811038740',
            '🎵': '1468584234363916298'
        };

        const roleId = roleMap[reaction.emoji.name];
        if (!roleId) return;

        const role = reaction.message.guild.roles.cache.get(roleId);
        if (!role) return;

        await member.roles.add(role);
    }
};
