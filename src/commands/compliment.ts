import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember, MessageFlags } from 'discord.js';
import { getKibunMood, generateResponse, generateCompliment } from '../kibunlogic';

export const data = new SlashCommandBuilder()
    .setName('compliment-me')
    .setDescription("Kibun gives you a... compliment?");

export async function execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inGuild() || !interaction.member) {
        await interaction.reply({ content: "This command can only be used in a server.", flags: MessageFlags.Ephemeral });
        return;
    }

    const member = interaction.member as GuildMember;
    const mood = getKibunMood(interaction);
    const compliments = generateCompliment(member);
    const response = generateResponse(mood, compliments);

    await interaction.reply(`<@${member.id}>, ${response}`);
}