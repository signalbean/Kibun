// calculating love with math because we're all dead inside
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { calculateShip } from '../kibunlogic';

export const data = new SlashCommandBuilder()
    .setName('ship')
    .setDescription('sees if two people are a vibe or a mess')
    .addUserOption(option =>
        option.setName('user1')
            .setDescription('the first victim')
            .setRequired(true))
    .addUserOption(option =>
        option.setName('user2')
            .setDescription('the second victim')
            .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
    const user1 = interaction.options.getUser('user1')!;
    const user2 = interaction.options.getUser('user2')!;

    if (user1.bot || user2.bot) {
        await interaction.reply("i cant ship bots they dont know pain or love");
        return;
    }

    if (user1.id === user2.id) {
        await interaction.reply("shipping someone with themself is just self love and its a 100% match go off");
        return;
    }

    const result = calculateShip(user1, user2);

    const embed = {
        color: 0xFF69B4,
        title: `vibe check for ${user1.username} & ${user2.username}`,
        description: `your ship name is **${result.shipName}**\ncompatibility: **${result.percentage}%**`,
        fields: [
            {
                name: "kibuns verdict",
                value: result.commentary,
            },
        ],
    };

    await interaction.reply({ embeds: [embed] });
}