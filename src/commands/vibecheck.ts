import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getKibunMood, generateResponse } from '../kibunlogic';

export const data = new SlashCommandBuilder()
    .setName('vibe-check')
    .setDescription('Checks the vibe of a user (or yourself).')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('The user to check')
            .setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user') ?? interaction.user;
    const mood = getKibunMood(interaction);

    const responseOptions = {
        PHILOSOPHICAL: `The vibe is transient, a fleeting moment in the digital ether. But for now, it's... contemplative.`,
        SASSY: `Vibe check? They're typing. Into a computer. That's the vibe. What more do you want?`,
        MELODRAMATIC: `Oh, the vibes... they're heavy with unspoken digital sorrow and the weight of a thousand un-posted memes. It's beautiful.`,
        ENTHUSIASTIC: `THE VIBE IS AMAZING! TOP TIER! S-RANK VIBES! I'M SO HYPED FOR THESE VIBES!`,
        LITERAL: `Scan complete. User is composed of 98% pixels and 2% existential dread. Vibe is nominal.`,
    };

    const response = generateResponse(mood, responseOptions);
    await interaction.reply(`Vibe check for <@${user.id}>: ${response}`);
}