// how are we feeling gamers
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getKibunMood, generateResponse } from '../kibunlogic';

export const data = new SlashCommandBuilder()
    .setName('vibe-check')
    .setDescription('checks the vibe obviously')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('the user to check or you if you leave it blank')
            .setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user') ?? interaction.user;
    const mood = getKibunMood(interaction);

    const responseOptions = {
        PHILOSOPHICAL: `the vibe is transient a fleeting moment in the digital ether for now its contemplative or bored same diff`,
        SASSY: `vibe check theyre typing into a computer thats the vibe what more do you want from me`,
        MELODRAMATIC: `oh the vibes theyre heavy with unspoken digital sorrow and the weight of a thousand un-posted memes its beautiful really`,
        ENTHUSIASTIC: `THE VIBE IS IMMACULATE TOP TIER S-RANK VIBES IM SO HYPED FOR THESE VIBES`,
        LITERAL: `scan complete user is composed of 98 percent pixels and 2 percent existential dread vibe is nominal`,
    };

    const response = generateResponse(mood, responseOptions);
    await interaction.reply(`vibe check for <@${user.id}> ${response}`);
}