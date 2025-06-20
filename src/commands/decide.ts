import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getKibunMood, makeDecision, generateResponse } from '../kibunlogic';

export const data = new SlashCommandBuilder()
    .setName('decide')
    .setDescription('Kibun makes a decision for you with flawless, silly logic.')
    .addStringOption(option =>
        option.setName('options')
            .setDescription('The choices, separated by a comma (e.g., Pizza, Tacos, Salad)')
            .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
    const optionsString = interaction.options.get('options')?.value as string;
    const options = optionsString.split(',').map(opt => opt.trim()).filter(Boolean);

    const decisionResult = makeDecision(options);

    if ('reason' in decisionResult) {
        await interaction.reply(`My choice is **${decisionResult.chosen}**. Why? ${decisionResult.reason}`);
        return;
    }

    const mood = getKibunMood(interaction);
    const reason = generateResponse(mood, decisionResult.reasons);

    await interaction.reply(`I have chosen: **${decisionResult.chosen}**. ${reason}`);
}