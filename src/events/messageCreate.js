const { Events, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const TARGET_CHANNEL_IDS = ['1475885543475777768', '1475865631441027082', '1475865597907701996']; // Replace with your channel IDs
const SUBMISSIONS_DB_PATH = path.join(__dirname, '..', '..', 'submitted-users.json');

// Load submissions map from the JSON file on startup.
// Structure: Map<channelId, Map<userId, messageId>>
let submissions = new Map();
try {
    if (fs.existsSync(SUBMISSIONS_DB_PATH)) {
        const data = fs.readFileSync(SUBMISSIONS_DB_PATH, 'utf8');
        const submissionsObject = JSON.parse(data);
        for (const channelId in submissionsObject) {
            submissions.set(channelId, new Map(Object.entries(submissionsObject[channelId])));
        }
        console.log(`Loaded submissions for ${submissions.size} channels from database.`);
    }
} catch (error) {
    console.error('Error loading submissions database:', error);
}

// A helper function to check if an attachment is an image
const isImage = (attachment) => {
    const contentType = attachment.contentType;
    return contentType && contentType.startsWith('image/');
};

// Helper function to save the nested map to the JSON file
const saveSubmissions = () => {
    try {
        const submissionsObject = {};
        for (const [channelId, userMap] of submissions.entries()) {
            submissionsObject[channelId] = Object.fromEntries(userMap);
        }
        fs.writeFileSync(SUBMISSIONS_DB_PATH, JSON.stringify(submissionsObject, null, 2));
    } catch (dbError) {
        console.error('Error saving to submissions database:', dbError);
    }
};

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

        // --- DM Command Logic ---
        if (!message.guild) { // This block handles DMs
            if (message.content.trim().toLowerCase() === '!status') {
                const user = message.author;

                try {
                    const workingMessage = await user.send('Fetching your status... this may take a moment.');

                    const statusEmbed = new EmbedBuilder()
                        .setTitle('Your Contest Status')
                        .setColor('#0099ff')
                        .setTimestamp();
                    
                    let description = '';

                    for (const channelId of TARGET_CHANNEL_IDS) {
                        try {
                            const channel = await message.client.channels.fetch(channelId);
                            if (!channel) continue;

                            // 1. Check submission status
                            const channelSubmissions = submissions.get(channelId);
                            const hasSubmitted = channelSubmissions && channelSubmissions.has(user.id);
                            const submissionStatus = `Submissions: ${hasSubmitted ? '1 of 1' : '0 of 1'} used`;

                            // 2. Check vote status
                            const messages = await channel.messages.fetch({ limit: 100 });
                            let userReactionCount = 0;
                            const ALLOWED_EMOJI = '❤️';
                            for (const msg of messages.values()) {
                                const reaction = msg.reactions.cache.get(ALLOWED_EMOJI);
                                if (reaction) {
                                    const users = await reaction.users.fetch();
                                    if (users.has(user.id)) {
                                        userReactionCount++;
                                    }
                                }
                            }
                            const voteStatus = `Votes: ${userReactionCount} of 3 used`;

                            description += `\n\n**[${channel.name}](<#${channelId}>)**\n- ${submissionStatus}\n- ${voteStatus}`;

                        } catch (channelError) {
                            console.error(`Failed to process channel ${channelId} for !status command:`, channelError);
                            description += `\n\n**Could not fetch status for channel ID \`${channelId}\`**`;
                        }
                    }

                    if (description === '') {
                        description = 'Could not find any configured contest channels.';
                    }

                    statusEmbed.setDescription(description.trim());
                    await workingMessage.edit({ content: 'Here is your status:', embeds: [statusEmbed] });

                } catch (error) {
                    console.error('Failed to execute !status command:', error);
                    await user.send('Sorry, there was an error trying to fetch your status.');
                }
            }
            return;
        }
        
        // --- Existing Submission Logic for Guild Channels ---
        if (!TARGET_CHANNEL_IDS.includes(message.channel.id)) {
            return;
        }

        const channelId = message.channel.id;
        const userId = message.author.id;

        // Ensure a map exists for the current channel
        if (!submissions.has(channelId)) {
            submissions.set(channelId, new Map());
        }
        const channelSubmissions = submissions.get(channelId);

        const attachments = message.attachments;
        if (attachments.size !== 1 || !isImage(attachments.first())) {
            try {
                // The original message is invalid, so we delete it before telling the user.
                await message.delete();
                await message.author.send('Your submission was invalid. Please submit a single image file.');
            } catch (error) {
                // If we can't delete or DM, just log it. The main thing is to not process it.
                console.error(`Error handling invalid submission by ${message.author.tag}:`, error);
            }
            return;
        }

        const image = attachments.first();
        const isUpdate = channelSubmissions.has(userId);

        try {
            // If it's an update, delete the old submission message first
            if (isUpdate) {
                const oldMessageId = channelSubmissions.get(userId);
                try {
                    const oldMessage = await message.channel.messages.fetch(oldMessageId);
                    await oldMessage.delete();
                } catch (fetchError) {
                    console.error(`Could not find or delete old message ${oldMessageId}:`, fetchError);
                }
            }

            const embed = new EmbedBuilder()
                .setTitle(isUpdate ? 'Updated Anonymous Submission' : 'New Anonymous Submission')
                .setImage(image.url)
                .setColor(isUpdate ? '#ffa500' : '#0099ff')
                .setTimestamp();

            const newMessage = await message.channel.send({ embeds: [embed] });
            await newMessage.react('❤️');

            // Update the map for the channel and save to file
            channelSubmissions.set(userId, newMessage.id);
            saveSubmissions();

            // Now that the new message is posted, delete the original user message
            await message.delete();

            try {
                const dmText = isUpdate 
                    ? 'Your submission has been successfully updated!'
                    : 'Your image has been submitted to the contest successfully!';
                await message.author.send(dmText);
            } catch (dmError) {
                console.error(`Could not send DM to ${message.author.tag}.`, dmError);
            }

        } catch (error) {
            console.error('Failed to process submission:', error);
            try {
                await message.author.send('There was an error submitting your image. Please try again or contact an admin.');
            } catch (dmError) {
                console.error(`Could not send DM to ${message.author.tag}.`, dmError);
            }
        }
    },
};
