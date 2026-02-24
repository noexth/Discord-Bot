const { Events } = require('discord.js');

const TARGET_CHANNEL_IDS = ['1475885543475777768', '1475865631441027082', '1475865597907701996', '1475910321637036032']; // Replace with your contest channel IDs

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
        if (TARGET_CHANNEL_IDS.includes(reaction.message.channel.id)) {
            const channel = reaction.message.channel;
            const reactingUser = await user.fetch();
            const ALLOWED_EMOJI = '❤️';

            // If the reaction is not the allowed one, remove it and stop.
            if (reaction.emoji.name !== ALLOWED_EMOJI) {
                try {
                    await reaction.users.remove(reactingUser.id);
                } catch (error) {
                    console.error('Failed to remove non-allowed reaction:', error);
                }
                return;
            }

            try {
                const messages = await channel.messages.fetch({ limit: 100 });
                let userReactionCount = 0;

                for (const message of messages.values()) {
                    // We only care about the allowed emoji for counting votes
                    const specificReaction = message.reactions.cache.get(ALLOWED_EMOJI);
                    if (specificReaction) {
                        const users = await specificReaction.users.fetch();
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
