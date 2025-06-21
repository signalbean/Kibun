import { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ChatInputCommandInteraction, MessageFlags, EmbedBuilder } from 'discord.js';

// Helper function to parse duration strings like "10m", "1h", "2d" into milliseconds
function parseDuration(durationStr: string): number | null {
    if (!durationStr) return null;
    const match = durationStr.trim().match(/^(\d+)\s*(s|m|h|d)$/i);
    if (!match) return null;

    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
        default: return null;
    }
}

export const data = new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Creates a poll, but Kibun adds its own chaotic option.');

export async function execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inGuild() || !interaction.channel) {
        await interaction.reply({ content: "This command only works in servers.", flags: MessageFlags.Ephemeral });
        return;
    }

    const modal = new ModalBuilder()
        .setCustomId('pollModal_v2') // Using a new ID to prevent conflicts
        .setTitle('Create a Poll');

    const questionInput = new TextInputBuilder().setCustomId('pollQuestion').setLabel("What is the poll question?").setStyle(TextInputStyle.Short).setRequired(true);
    const option1Input = new TextInputBuilder().setCustomId('pollOption1').setLabel("Option 1").setStyle(TextInputStyle.Short).setRequired(true);
    const option2Input = new TextInputBuilder().setCustomId('pollOption2').setLabel("Option 2").setStyle(TextInputStyle.Short).setRequired(true);
    const option3Input = new TextInputBuilder().setCustomId('pollOption3').setLabel("Option 3 (Optional)").setStyle(TextInputStyle.Short).setRequired(false);
    const durationInput = new TextInputBuilder().setCustomId('pollDuration').setLabel("Duration (e.g., 10m, 1h, 2d) (Optional)").setStyle(TextInputStyle.Short).setRequired(false);

    modal.addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(questionInput),
        new ActionRowBuilder<TextInputBuilder>().addComponents(option1Input),
        new ActionRowBuilder<TextInputBuilder>().addComponents(option2Input),
        new ActionRowBuilder<TextInputBuilder>().addComponents(option3Input),
        new ActionRowBuilder<TextInputBuilder>().addComponents(durationInput)
    );

    await interaction.showModal(modal);

    try {
        const submission = await interaction.awaitModalSubmit({ time: 120_000 });

        const question = submission.fields.getTextInputValue('pollQuestion');
        const options = [
            submission.fields.getTextInputValue('pollOption1'),
            submission.fields.getTextInputValue('pollOption2'),
            submission.fields.getTextInputValue('pollOption3'),
        ].filter(Boolean);

        const durationStr = submission.fields.getTextInputValue('pollDuration');
        const durationMs = parseDuration(durationStr);

        const kibunOptions = ["I abstain, for philosophical reasons.", "All of the above, but in a sarcastic font.", "None of the above; I choose chaos.", "The answer is clearly beige."];
        const kibunChoice = kibunOptions[Math.floor(Math.random() * kibunOptions.length)];
        options.push(kibunChoice);

        const emojiMap = ['1️⃣', '2️⃣', '3️⃣', '🤖'];
        let pollString = `**📊 ${question}**\n\n${options.map((opt, i) => `${emojiMap[i]} : ${opt}`).join('\n\n')}`;

        if (durationMs) {
            const closingTime = Math.floor((Date.now() + durationMs) / 1000);
            pollString += `\n\n*This poll will close <t:${closingTime}:R>.
*`;
        }

        await submission.reply({ content: pollString, fetchReply: true });
        const pollMessage = await submission.fetchReply();

        for (let i = 0; i < options.length; i++) {
            await pollMessage.react(emojiMap[i]);
        }

        if (durationMs) {
            setTimeout(async () => {
                try {
                    const fetchedMessage = await interaction.channel?.messages.fetch(pollMessage.id);
                    if (!fetchedMessage) return;

                    const results = options.map((option, i) => {
                        const reaction = fetchedMessage.reactions.cache.get(emojiMap[i]);
                        const count = (reaction?.count ?? 1) - 1; // Subtract bot's own reaction
                        return { option, count, emoji: emojiMap[i] };
                    }).sort((a, b) => b.count - a.count);

                    const winner = results[0];
                    const winners = results.filter(r => r.count === winner.count && winner.count > 0);

                    const resultsEmbed = new EmbedBuilder().setTitle(`Poll Results: "${question}"`).setColor(0x7289DA);
                    if (winners.length === 0) {
                        resultsEmbed.setDescription("The poll has ended! No one voted. 🤷");
                    } else if (winners.length > 1) {
                        resultsEmbed.setDescription(`The poll has ended! It's a tie between ${winners.map(w => `**${w.option}**`).join(' and ')} with ${winner.count} vote(s)!`);
                    } else {
                        resultsEmbed.setDescription(`The poll has ended! The winner is **${winner.option}** with ${winner.count} vote(s)!`);
                    }
                    resultsEmbed.addFields({ name: 'Final Tally', value: results.map(r => `${r.emoji} ${r.option}: **${r.count}** vote(s)`).join('\n') });
                    
                    const finalPollString = `**📊 ${question}**\n\n${options.map((opt, i) => `${emojiMap[i]} : ${opt}`).join('\n\n')}\n\n*This poll has ended.*`;
                    await fetchedMessage.edit(finalPollString);
                    await fetchedMessage.reply({ embeds: [resultsEmbed] });

                } catch (e) {
                    console.error("Error closing poll:", e);
                    await interaction.channel?.send({ content: `There was an error tallying the results for the poll: "${question}"` });
                }
            }, durationMs);
        }
    } catch (e) {
        console.log("Poll modal likely timed out.");
    }
}