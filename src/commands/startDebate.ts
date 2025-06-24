// start an argument on purpose what could go wrong
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getDebateTopic } from '../kibunlogic';

export const data = new SlashCommandBuilder()
    .setName('start-debate')
    .setDescription('starts a pointless argument');

export async function execute(interaction: ChatInputCommandInteraction) {
    const topic = getDebateTopic();
    await interaction.reply(`alright new debate just dropped argue about this\n\n**${topic}**\n\ngo`);
}