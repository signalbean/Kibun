// for when you need to flake on your friends
// we are providing a valuable service here
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { generateExcuse } from '../kibunlogic';

export const data = new SlashCommandBuilder()
    .setName('generate-excuse')
    .setDescription('generates a bulletproof excuse so you can flake on people');

export async function execute(interaction: ChatInputCommandInteraction) {
    const excuse = generateExcuse();
    await interaction.reply(excuse);
}