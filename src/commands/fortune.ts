// deterministically generated bullshit fortune generator right here
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getDailyFortune } from '../kibunlogic';

export const data = new SlashCommandBuilder()
    .setName('fortune')
    .setDescription('tells you your daily totally-not-made-up fortune');

export async function execute(interaction: ChatInputCommandInteraction) {
    const fortune = getDailyFortune(interaction.user);
    await interaction.reply(`your vibe for today is **${fortune}**`);
}