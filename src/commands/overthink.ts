// a command for my fellow anxiety-havers
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getKibunMood, generateResponse } from '../kibunlogic';

export const data = new SlashCommandBuilder()
    .setName('overthink')
    .setDescription('spirals about a simple problem for you')
    .addStringOption(option =>
        option.setName('problem')
            .setDescription('the tiny issue you want me to blow out of proportion')
            .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
    const problem = interaction.options.get('problem')?.value as string;
    const mood = getKibunMood(interaction);

    const responseOptions = {
        PHILOSOPHICAL: `the issue isnt '${problem}' the real issue is the concept of 'problems' themselves we must first deconstruct`,
        SASSY: `oh '${problem}' groundbreaking did you try like just not having that problem no shocker`,
        MELODRAMATIC: `the sheer weight of '${problem}' its crushing me the implications the consequences i need to lie down`,
        ENTHUSIASTIC: `wow '${problem}' AMAZING lets build a multi-step plan we can solve this by sunrise LETS GOOO`,
        LITERAL: `statement '${problem}' analysis this is a suboptimal state recommendation stop having a suboptimal state`,
    };

    const response = generateResponse(mood, responseOptions);
    await interaction.reply(response);
}