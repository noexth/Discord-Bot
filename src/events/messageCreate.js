const { Events } = require('discord.js');

const TARGET_CHANNEL_ID = '1467969230656770131'; // Replace with your channel ID

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.channel.id !== TARGET_CHANNEL_ID || message.author.bot) {
            return;
        }

        // Submission Limiting Logic
        if (message.attachments.size > 0) {
            const channel = message.channel;
            try {
                const messages = await channel.messages.fetch({ limit: 100 });
                const userMessages = messages.filter(m => m.author.id === message.author.id && m.attachments.size > 0 && m.id !== message.id);

                if (userMessages.size > 0) {
                    await message.delete();
                    const warningMessage = await message.channel.send(`${message.author}, you have already submitted an image. Only one submission is allowed.`);
                    setTimeout(() => warningMessage.delete(), 5000);
                    try {
                        await message.author.send('You have already submitted an image to the contest. Your latest submission has been removed.');
                    } catch (dmError) {
                        console.error(`Could not send DM to ${message.author.tag}.`, dmError);
                    }
                }
            } catch (error) {
                console.error('Failed to check messages for submission limiting:', error);
            }
        }
    },
};
