import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getKibunMood, generateResponse } from '../kibunlogic';

export const data = new SlashCommandBuilder()
    .setName('overthink')
    .setDescription('Kibun will dramatically overthink a simple problem for you.')
    .addStringOption(option =>
        option.setName('problem')
            .setDescription('The simple problem you want overthought')
            .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
    const problem = interaction.options.get('problem')?.value as string;
    const mood = getKibunMood(interaction);

    const responseOptions = {
        PHILOSOPHICAL: `The problem is not '${problem}'. The problem is the concept of problems themselves. We must first deconstruct the definition of 'problem' before we can even...`,
        SASSY: `Oh, '${problem}'. Groundbreaking. Have you considered just... not having that problem? No? Didn't think so.`,
        MELODRAMATIC: `The sheer weight of '${problem}'... it's crushing. The implications, the consequences... I need to lie down.`,
        ENTHUSIASTIC: `Wow, '${problem}'! What an INCREDIBLE challenge! Let's whiteboard this! Let's build a multi-step plan! We can solve this by sunrise!`,
        LITERAL: `The statement is: '${problem}'. Analysis: This is a suboptimal state. Recommendation: Transition to an optimal state.`,
    };

    const response = generateResponse(mood, responseOptions);
    await interaction.reply(response);
}