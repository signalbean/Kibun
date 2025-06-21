// lets be honest these arent real compliments
import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember, MessageFlags } from 'discord.js';
import { getKibunMood, generateResponse, generateCompliment } from '../kibunlogic';

export const data = new SlashCommandBuilder()
    .setName('compliment-me')
    .setDescription("drops a backhanded compliment on ya");

export async function execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inGuild() || !interaction.member) {
        await interaction.reply({ content: "this only works in a server my dude", flags: MessageFlags.Ephemeral });
        return;
    }

    const member = interaction.member as GuildMember;
    const mood = getKibunMood(interaction);
    const compliments = generateCompliment(member);
    const response = generateResponse(mood, compliments);

    await interaction.reply(`<@${member.id}> ${response}`);
}