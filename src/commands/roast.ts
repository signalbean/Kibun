import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember, MessageFlags } from 'discord.js';
import { getKibunMood, generateResponse, generateRoast } from '../kibunlogic';

export const data = new SlashCommandBuilder()
    .setName('roast-me')
    .setDescription("Kibun delivers a mood-based burn.");

export async function execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inGuild() || !interaction.member) {
        await interaction.reply({ content: "This command can only be used in a server.", flags: MessageFlags.Ephemeral });
        return;
    }

    const member = interaction.member as GuildMember;
    const mood = getKibunMood(interaction);
    const roasts = generateRoast(member);
    const response = generateResponse(mood, roasts);

    await interaction.reply(`<@${member.id}>, ${response}`);
}