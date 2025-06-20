import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { calculateShip } from '../kibunlogic';

export const data = new SlashCommandBuilder()
    .setName('ship')
    .setDescription('Generates a "compatibility report" for two users.')
    .addUserOption(option =>
        option.setName('user1')
            .setDescription('The first user')
            .setRequired(true))
    .addUserOption(option =>
        option.setName('user2')
            .setDescription('The second user')
            .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
    const user1 = interaction.options.getUser('user1')!;
    const user2 = interaction.options.getUser('user2')!;

    if (user1.bot || user2.bot) {
        await interaction.reply("I can't ship bots, they lack the capacity for true love or chaotic arguments.");
        return;
    }

    if (user1.id === user2.id) {
        await interaction.reply("Shipping someone with themselves? That's just self-love, and it's a 100% perfect match. Go you.");
        return;
    }

    const result = calculateShip(user1, user2);

    const embed = {
        color: 0xFF69B4,
        title: `Love-o-Meter Results for ${user1.username} & ${user2.username}`,
        description: `Ship Name: **${result.shipName}**\nCompatibility: **${result.percentage}%**`,
        fields: [
            {
                name: 'Kibun\'s Commentary',
                value: result.commentary,
            },
        ],
    };

    await interaction.reply({ embeds: [embed] });
}