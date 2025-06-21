// who the fuck needs a real poll bot when you have this chaotic piece of shit
import { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ChatInputCommandInteraction, MessageFlags, EmbedBuilder } from 'discord.js';

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
    .setDescription('makes a poll but i add my own chaotic option obviously');

export async function execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inGuild() || !interaction.channel) {
        await interaction.reply({ content: "this only works in a server my dude", flags: MessageFlags.Ephemeral });
        return;
    }

    const modal = new ModalBuilder()
        .setCustomId('pollModal_v3')
        .setTitle('make a poll or whatever');

    const questionInput = new TextInputBuilder().setCustomId('pollQuestion').setLabel("so whats the question").setStyle(TextInputStyle.Short).setRequired(true);
    const option1Input = new TextInputBuilder().setCustomId('pollOption1').setLabel("option 1").setStyle(TextInputStyle.Short).setRequired(true);
    const option2Input = new TextInputBuilder().setCustomId('pollOption2').setLabel("option 2").setStyle(TextInputStyle.Short).setRequired(true);
    const option3Input = new TextInputBuilder().setCustomId('pollOption3').setLabel("option 3 (if youre feeling spicy)").setStyle(TextInputStyle.Short).setRequired(false);
    const durationInput = new TextInputBuilder().setCustomId('pollDuration').setLabel("duration (e.g. 10m 1h) (optional)").setStyle(TextInputStyle.Short).setRequired(false);

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
        const kibunOptions = ["i abstain for philosophical reasons", "all of the above but in a sarcastic font", "none of the above i choose chaos", "the answer is clearly beige"];
        const kibunChoice = kibunOptions[Math.floor(Math.random() * kibunOptions.length)];
        options.push(kibunChoice);
        const emojiMap = ['1️⃣', '2️⃣', '3️⃣', '🤖'];
        let pollString = `**📊 ${question}**\n\n${options.map((opt, i) => `${emojiMap[i]} : ${opt}`).join('\n\n')}`;
        if (durationMs) {
            const closingTime = Math.floor((Date.now() + durationMs) / 1000);
            pollString += `\n\n*this poll will close <t:${closingTime}:R>*`;
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
                        const count = (reaction?.count ?? 1) - 1;
                        return { option, count, emoji: emojiMap[i] };
                    }).sort((a, b) => b.count - a.count);
                    const winner = results[0];
                    const winners = results.filter(r => r.count === winner.count && winner.count > 0);
                    const resultsEmbed = new EmbedBuilder().setTitle(`poll results for "${question}"`).setColor(0x7289DA);
                    if (winners.length === 0) {
                        resultsEmbed.setDescription("the poll ended and no one voted lmao 🤷");
                    } else if (winners.length > 1) {
                        resultsEmbed.setDescription(`the poll ended in a tie between ${winners.map(w => `**${w.option}**`).join(' and ')} with ${winner.count} votes`);
                    } else {
                        resultsEmbed.setDescription(`the poll ended the winner is **${winner.option}** with ${winner.count} votes`);
                    }
                    resultsEmbed.addFields({ name: 'final tally', value: results.map(r => `${r.emoji} ${r.option}: **${r.count}** votes`).join('\n') });
                    const finalPollString = `**📊 ${question}**\n\n${options.map((opt, i) => `${emojiMap[i]} : ${opt}`).join('\n\n')}\n\n*this poll has ended*`;
                    await fetchedMessage.edit(finalPollString);
                    await fetchedMessage.reply({ embeds: [resultsEmbed] });
                } catch (e) {
                    console.error("Error closing poll:", e);
                    await interaction.channel?.send({ content: `i broke trying to close the poll for "${question}" my bad` });
                }
            }, durationMs);
        }
    } catch (e) {
        console.log("Poll modal likely timed out probably for the best");
    }
}