import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { generateExcuse } from '../kibunlogic';

export const data = new SlashCommandBuilder()
    .setName('generate-excuse')
    .setDescription('Generates a bulletproof excuse for any situation.');

export async function execute(interaction: ChatInputCommandInteraction) {
    const excuse = generateExcuse();
    await interaction.reply(excuse);
}