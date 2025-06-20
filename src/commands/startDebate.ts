import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getDebateTopic } from '../kibunlogic';

export const data = new SlashCommandBuilder()
    .setName('start-debate')
    .setDescription('Kibun starts a pointless debate.');

export async function execute(interaction: ChatInputCommandInteraction) {
    const topic = getDebateTopic();
    await interaction.reply(`A new debate has begun! The topic is:\n\n**${topic}**\n\nDiscuss.`);
}