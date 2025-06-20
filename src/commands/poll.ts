import { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ChatInputCommandInteraction, MessageFlags } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Creates a poll, but Kibun adds its own chaotic option.');

export async function execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inGuild()) {
        await interaction.reply({ content: "This command only works in servers.", flags: MessageFlags.Ephemeral });
        return;
    }

    const modal = new ModalBuilder()
        .setCustomId('pollModal')
        .setTitle('Create a Poll');

    const questionInput = new TextInputBuilder()
        .setCustomId('pollQuestion')
        .setLabel("What is the poll question?")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const option1Input = new TextInputBuilder()
        .setCustomId('pollOption1')
        .setLabel("Option 1")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const option2Input = new TextInputBuilder()
        .setCustomId('pollOption2')
        .setLabel("Option 2")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const option3Input = new TextInputBuilder()
        .setCustomId('pollOption3')
        .setLabel("Option 3 (Optional)")
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

    modal.addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(questionInput),
        new ActionRowBuilder<TextInputBuilder>().addComponents(option1Input),
        new ActionRowBuilder<TextInputBuilder>().addComponents(option2Input),
        new ActionRowBuilder<TextInputBuilder>().addComponents(option3Input)
    );

    await interaction.showModal(modal);

    try {
        const submission = await interaction.awaitModalSubmit({ time: 60_000 });

        const question = submission.fields.getTextInputValue('pollQuestion');
        const option1 = submission.fields.getTextInputValue('pollOption1');
        const option2 = submission.fields.getTextInputValue('pollOption2');
        const option3 = submission.fields.getTextInputValue('pollOption3');

        const kibunOptions = [
            "I abstain, for philosophical reasons.",
            "All of the above, but in a sarcastic font.",
            "None of the above; I choose chaos.",
            "The answer is clearly beige."
        ];
        const kibunChoice = kibunOptions[Math.floor(Math.random() * kibunOptions.length)];

        let pollString = `**📊 ${question}**\n\n`;
        pollString += `1️⃣ : ${option1}\n\n`;
        pollString += `2️⃣ : ${option2}\n\n`;
        if (option3) {
            pollString += `3️⃣ : ${option3}\n\n`;
        }
        pollString += `🤖 : ${kibunChoice}`;

        await submission.reply({ content: pollString });
        const pollMessage = await submission.fetchReply();

        await pollMessage.react('1️⃣');
        await pollMessage.react('2️⃣');
        if (option3) {
            await pollMessage.react('3️⃣');
        }
        await pollMessage.react('🤖');

    } catch (e) {
        await interaction.followUp({ content: 'Poll creation timed out or failed.', flags: MessageFlags.Ephemeral });
    }
}