require('dotenv').config();
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const channel = member.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor(0x00FFAA)
            // .setAuthor({
            //     name: 'Welcome System',
            //     iconURL: member.guild.iconURL({ dynamic: true })
            // })
            .setTitle('✨ Welcome to the Server!')
            .setDescription(
                `Hi ${member} 👋\n\n` +
                `Welcome to **${member.guild.name}**.\n` +
                `We're happy to have you with us!\n\n` +
                `📌 **Make sure to check out:**\n` +
                `⟫ <#1467956952293179616>\n` + // guidelines channel
                `⟫ <#1467962632534495510>\n` + // self roles channel
                `⟫ <#1467927796427784350>\n\n` // chit-chat channel
            )

            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
            .setImage('https://cdn.discordapp.com/banners/473829086515691530/a_18ead34385fd8a4cbcf5999f0427efe5.webp?size=4096&animated=true')
            .addFields(
                {
                    name: '👤 Member',
                    value: `<@${member.id}>`,
                    inline: true
                },
                // {
                //     name: '🕒 Akun Dibuat',
                //     value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
                //     inline: true
                // },
                {
                    name: '📊 Server Statistics',
                    value: `Member count reached **${member.guild.memberCount}** with you!`,
                    inline: true
                }
            )
            .setFooter({
                text: `${member.guild.name}`,
                iconURL: 'https://assets-ng.maxroll.gg/sr-tools/assets/db/icons/items/socials/personalzone_medal_icon_01_30.webp'
                // iconURL: member.guild.iconURL({ dynamic: true })
            })
            .setTimestamp();

        channel.send({ embeds: [embed] });
    }
};
