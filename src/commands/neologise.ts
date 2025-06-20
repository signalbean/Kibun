import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { neologize } from '../kibunlogic';

export const data = new SlashCommandBuilder()
    .setName('neologize')
    .setDescription('Creates a new word and its definition from a base word.')
    .addStringOption(option =>
        option.setName('word')
            .setDescription('The word to transform')
            .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
    const word = interaction.options.get('word')?.value as string;
    const result = neologize(word);

    await interaction.reply(`Your new word is **${result.newWord}**. \n*${result.definition}*`);
}