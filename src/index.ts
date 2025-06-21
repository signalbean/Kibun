// this is the main file that runs the whole show
// if the bot is on fire this is probably the first place to look
import fs from 'node:fs';
import path from 'node:path';
import { Client, Collection, Events, GatewayIntentBits, REST, Routes, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config();

interface Command {
    data: any;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});
const commands = new Collection<string, Command>();

const fileExtension = __filename.endsWith('.ts') ? '.ts' : '.js';
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(fileExtension));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command: Command = require(filePath);
	if ('data' in command && 'execute' in command) {
		commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

const token = process.env.DISCORD_TOKEN!;
const clientId = process.env.CLIENT_ID!;
const rest = new REST().setToken(token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.size} application (/) commands.`);
        const commandData = Array.from(commands.values()).map(c => c.data.toJSON());
        const data: any = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commandData },
        );
        console.log(`Successfully reloaded ${data.length} application (/) commands globally.`);
        client.login(token);
    } catch (error) {
        console.error('Failed to reload commands or login:', error);
    }
})();

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        // an actual, real fucking error happened inside the command logic.
        // the defer/edit pattern in the commands should prevent the bullshit "unknown interaction" errors.
        // so if this block runs, something else is truly fucked.
        console.error(`[CRITICAL] Error in command '${interaction.commandName}':`, error);
        
        // since we almost certainly deferred the reply, we have to edit it or follow up.
        if (interaction.replied || interaction.deferred) {
            await interaction.editReply({ content: 'shit broke lol my bad' }).catch(e => {
                // if editReply fails, try a followUp. if this fails too, we're toast.
                console.error("[ULTRA-CRITICAL] Couldn't even edit the reply. Trying a follow-up.", e)
                interaction.followUp({ content: 'shit broke so bad i couldnt even edit my first reply lmao', ephemeral: true });
            });
        } else {
           // if we somehow failed before deferring, try a normal reply as a last ditch effort.
           await interaction.reply({ content: 'shit broke right at the start lmao', ephemeral: true });
        }
    }
});

export { client };