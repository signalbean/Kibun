// this whole command is just a glorified math.random() with extra steps lets be real
import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { getKibunMood, generateResponse, getAvatarAnalysis } from '../kibunlogic';

export const data = new SlashCommandBuilder()
    .setName('rate-my-avatar')
    .setDescription("rates ur pfp with zero chill");

export async function execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user') ?? interaction.user;
    const mood = getKibunMood(interaction);
    const analysis = getAvatarAnalysis(user);

    const response = generateResponse(mood, analysis.commentary);

    const embed = {
        color: 0x7289DA,
        author: {
            name: `aight lets see this pfp for ${user.username}`,
            icon_url: user.displayAvatarURL(),
        },
        fields: [
            { name: 'Color Harmony', value: analysis.harmony, inline: true },
            { name: 'Composition', value: analysis.composition, inline: true },
            { name: 'Meme Potential', value: analysis.memePotential, inline: true },
            { name: 'Overall Score', value: `**${analysis.overall}**` },
            { name: 'My Hot Take', value: response },
        ],
        thumbnail: {
            url: user.displayAvatarURL(),
        },
    };

    await interaction.reply({ embeds: [embed] });
}