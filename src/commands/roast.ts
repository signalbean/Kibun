// you want the smoke you get the smoke
import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember, MessageFlags } from 'discord.js';
import { getKibunMood, generateResponse, generateRoast } from '../kibunlogic';

export const data = new SlashCommandBuilder()
    .setName('roast-me')
    .setDescription("flame roasts you you asked for this");

export async function execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inGuild() || !interaction.member) {
        await interaction.reply({ content: "this only works in a server my dude", flags: MessageFlags.Ephemeral });
        return;
    }

    const member = interaction.member as GuildMember;
    const mood = getKibunMood(interaction);
    const roasts = generateRoast(member);
    const response = generateResponse(mood, roasts);

    await interaction.reply(`<@${member.id}> ${response}`);
}