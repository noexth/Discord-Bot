module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user) {
        if (reaction.partial) await reaction.fetch();
        if (user.bot) return;

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
