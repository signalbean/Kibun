// this command used to be so fucking stupid it wasn't even random
// thank god we fixed it
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getKibunMood, makeDecision, generateResponse } from '../kibunlogic';

export const data = new SlashCommandBuilder()
    .setName('decide')
    .setDescription('makes a choice for your indecisive ass')
    .addStringOption(option =>
        option.setName('options')
            .setDescription('the choices separated by a comma cmon you know how this works')
            .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
    const optionsString = interaction.options.get('options')?.value as string;
    const options = optionsString.split(',').map(opt => opt.trim()).filter(Boolean);

    const decisionResult = makeDecision(options);

    if ('reason' in decisionResult) {
        await interaction.reply(`my choice is **${decisionResult.chosen}** why ${decisionResult.reason}`);
        return;
    }

    const mood = getKibunMood(interaction);
    const reason = generateResponse(mood, decisionResult.reasons);

    await interaction.reply(`i have chosen **${decisionResult.chosen}** ${reason}`);
}