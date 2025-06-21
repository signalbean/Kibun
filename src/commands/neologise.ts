// this one is for the english majors who are also shitposters
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { neologize } from '../kibunlogic';

export const data = new SlashCommandBuilder()
    .setName('neologize')
    .setDescription('messes up a word to make a new one totally normal')
    .addStringOption(option =>
        option.setName('word')
            .setDescription('the word you want me to butcher')
            .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
    const word = interaction.options.get('word')?.value as string;
    const result = neologize(word);

    await interaction.reply(`your new word is **${result.newWord}** \n*${result.definition}*`);
}