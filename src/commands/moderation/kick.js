const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick member dari server')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Member yang mau di kick')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const member = interaction.options.getMember('target');

        if (!member.kickable) {
            return interaction.reply({ content: '❌ Tidak bisa kick user ini.', ephemeral: true });
        }

        await member.kick();
        await interaction.reply(`👢 ${member.user.tag} berhasil di kick.`);
    }
};
