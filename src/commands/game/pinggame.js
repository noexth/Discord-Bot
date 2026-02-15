const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pinggame')
        .setDescription('Tes reaksi kamu'),

    async execute(interaction) {
        const sent = await interaction.reply({ content: '🏓 Tunggu...', fetchReply: true });
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply(`⚡ Reaksi kamu: **${latency}ms**`);
    }
};
