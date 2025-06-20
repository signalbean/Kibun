import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getDailyFortune } from '../kibunlogic';

export const data = new SlashCommandBuilder()
    .setName('fortune')
    .setDescription('Provides a daily, deterministically generated, mundane fortune.');

export async function execute(interaction: ChatInputCommandInteraction) {
    const fortune = getDailyFortune(interaction.user);
    await interaction.reply(`Your fortune for today is: **${fortune}**`);
}