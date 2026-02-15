const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolesetup')
        .setDescription('Kirim panel reaction role RPG')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle('✨ Choose Your Class')
            .setDescription(
                `> **React pada emoji sesuai class yang kamu mainkan**\n\n` +

                `━━━━━━━━━━━━━━━━━━\n` +
                `🪃 **Heavy Guardian**  \n` +
                `┗ Tank garis depan dengan pertahanan super tebal\n\n` +

                `❄️ **Frost Mage**  \n` +
                `┗ Pengendali es dengan burst magic mematikan\n\n` +

                `🌿 **Verdant Oracle**  \n` +
                `┗ Support alami dengan kemampuan heal & buff\n\n` +

                `⚔️ **Storm Blade**  \n` +
                `┗ DPS cepat dengan serangan lincah mematikan\n\n` +

                `🌪️ **Wind Knight**  \n` +
                `┗ Fighter gesit dengan mobilitas tinggi\n\n` +

                `🏹 **Marksman**  \n` +
                `┗ Penyerang jarak jauh dengan presisi tinggi\n\n` +

                `🛡️ **Shield Knight**  \n` +
                `┗ Defender pelindung tim dengan shield kuat\n\n` +

                `🎵 **Beat Performer**  \n` +
                `┗ Support musik dengan buff ritme pertempuran\n` +
                `━━━━━━━━━━━━━━━━━━`
            )
            .setFooter({ text: 'Blue Protocol • Star Resonance Role System' })
            .setTimestamp();

        const message = await interaction.channel.send({ embeds: [embed] });

        const emojis = ['🪃','❄️','🌿','⚔️','🌪️','🏹','🛡️','🎵'];
        for (const emoji of emojis) {
            await message.react(emoji);
        }

        await interaction.editReply({ content: `✅ Panel role berhasil dibuat!\nMessage ID: \`${message.id}\`` });
    }
};
