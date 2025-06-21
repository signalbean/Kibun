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
        console.error(`[DIAGNOSTIC] An error occurred in command '${interaction.commandName}':`);
        console.error(error);
    }
});

export { client };