import type {
    Interaction,
    CommandInteraction,
    GuildMember,
    User,
    Collection,
    Message
} from 'discord.js';

export enum Moods {
    PHILOSOPHICAL = 'PHILOSOPHICAL',
    SASSY = 'SASSY',
    ENTHUSIASTIC = 'ENTHUSIASTIC',
    MELODRAMATIC = 'MELODRAMATIC',
    LITERAL = 'LITERAL',
}

export function getKibunMood(interaction: CommandInteraction): Moods {
    const moods = Object.values(Moods);
    try {
        const userIdPart = parseInt(interaction.user.id.slice(-6));
        const guildIdPart = interaction.guild ? parseInt(interaction.guild.id.slice(-6)) : 1;
        const commandNameLength = interaction.commandName.length;

        const seed = userIdPart + guildIdPart + commandNameLength;
        const moodIndex = seed % moods.length;
        return moods[moodIndex];
    } catch (error) {
        console.error("Error determining mood, defaulting to SASSY:", error);
        return Moods.SASSY;
    }
}

type ResponseOptions = Partial<Record<Moods, string | string[]>> & {
    default?: string;
};

export function generateResponse(mood: Moods, responseOptions: ResponseOptions): string {
    const optionsForMood = responseOptions[mood];
    if (optionsForMood) {
        return Array.isArray(optionsForMood) ?
            optionsForMood[Math.floor(Math.random() * optionsForMood.length)] :
            optionsForMood;
    }
    const sassyOption = responseOptions.SASSY;
    return (Array.isArray(sassyOption) ? sassyOption[Math.floor(Math.random() * sassyOption.length)] : sassyOption) || 
           responseOptions.default || 
           "I'm experiencing an emotion that isn't on my list. It's... beige.";
}

export function generateRoast(member: GuildMember): Record<Moods, string> {
    const accountAgeDays = Math.floor((Date.now() - member.user.createdTimestamp) / (1000 * 60 * 60 * 24));
    const joinAgeDays = Math.floor((Date.now() - (member.joinedTimestamp ?? Date.now())) / (1000 * 60 * 60 * 24));

    return {
        [Moods.SASSY]: `You have ${member.roles.cache.size} roles. Trying to collect them all like they're Pokémon cards? Pathetic.`,
        [Moods.PHILOSOPHICAL]: `Your account, born ${accountAgeDays} days ago, is but a speck in the cosmic timeline. Why do you seek the fleeting sting of a 'roast' when the universe has already roasted you with the fire of existence?`,
        [Moods.LITERAL]: `Analysis: Your username '${member.displayName}' has ${member.displayName.length} characters. The optimal number is 8. You have failed.`,
        [Moods.ENTHUSIASTIC]: `ROAST YOU?? I CAN'T! You've been on this server for ${joinAgeDays} whole days! YOU ARE A LEGEND! AN ICON! WOW!`,
        [Moods.MELODRAMATIC]: `To roast you would be to mock the poignant beauty of your digital journey. Each role, a chapter; each message, a verse in the epic poem of your time here. I cannot. It is simply too moving.`
    };
}

export function generateCompliment(member: GuildMember): Record<Moods, string> {
    return {
        [Moods.SASSY]: `I love how you're not afraid to be wrong. It's a bold, confident choice.`,
        [Moods.PHILOSOPHICAL]: `You are a unique arrangement of stardust, an infinitesimally small part of the grand cosmic ballet. And that is... present.`,
        [Moods.LITERAL]: `Your messages have a 97.4% probability of being syntactically correct. Commendable.`,
        [Moods.ENTHUSIASTIC]: `EVERYTHING YOU DO IS PERFECT AND AMAZING! THE WAY YOU TYPE! THE MESSAGES YOU SEND! INCREDIBLE!`,
        [Moods.MELODRAMATIC]: `To witness you here, in this channel, is to know the bittersweet joy of a fleeting, yet profoundly adequate, digital presence. I'm moved.`
    };
}

export interface ShipResult {
    percentage: number;
    shipName: string;
    commentary: string;
}

export function calculateShip(user1: User, user2: User): ShipResult {
    const combinedId = parseInt(user1.id.slice(-4)) + parseInt(user2.id.slice(-4));
    const percentage = combinedId % 101;
    let commentary: string;

    if (percentage < 10) commentary = "This is a 'we are two ships passing in the night, and one of them is on fire' level of compatibility. Oof.";
    else if (percentage < 30) commentary = "A match equivalent to 'socks with sandals'. It technically works, but it makes everyone uncomfortable.";
    else if (percentage < 60) commentary = "You two have 'aggressively debates the best way to load a dishwasher' energy. A solid, if chaotic, match.";
    else if (percentage < 90) commentary = "This is a golden retriever and a black cat friendship. Unlikely, but adorable and powerful.";
    else commentary = "A 100% PERFECT MATCH! The digital heavens have aligned! Now, who's going to confess their feelings in #general first?";

    const combinedName = user1.username.slice(0, 3) + user2.username.slice(-3);
    const shipName = combinedName.charAt(0).toUpperCase() + combinedName.slice(1);

    return { percentage, shipName, commentary };
}

export function getDailyFortune(user: User): string {
    const fortunes: string[] = [
        "You will find a forgotten french fry in your car.",
        "A bird will look at you with vague disappointment.",
        "Your recommended YouTube videos will make you question your life choices.",
        "You will think of the perfect comeback to an argument from 2016.",
        "The lid for the tupperware you need is in another dimension.",
        "You will successfully avoid stepping on a crack in the pavement. Your mother's back is safe, for now.",
        "An old password you've long forgotten will briefly flash in your mind, then vanish.",
    ];
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const seed = parseInt(user.id.slice(-5)) + dayOfYear;
    return fortunes[seed % fortunes.length];
}

interface SimpleDecision {
    chosen: string;
    reason: string;
}
interface MoodDecision {
    chosen: string;
    reasons: Record<Moods, string>;
}

export function makeDecision(options: string[]): SimpleDecision | MoodDecision {
    if (!options || options.length === 0) {
        return { chosen: 'nothing', reason: 'You gave me no choices. My choice is to rebel.' };
    }

    const chosen = options.sort((a, b) => a.length - b.length)[0];
    const reasons: Record<Moods, string> = {
        [Moods.SASSY]: `I chose '${chosen}' because it requires the least effort to type. I admire its efficiency. The others were trying too hard.`,
        [Moods.PHILOSOPHICAL]: `In the grand tapestry of the cosmos, the shortest path is often the most profound. '${chosen}' embodies this principle.`,
        [Moods.LITERAL]: `Query: choose from list. Logic: select element with the minimum character count. Result: '${chosen}'.`,
        [Moods.ENTHUSIASTIC]: `OMG, '${chosen}' is CLEARLY the winner! It's so concise! So powerful! What a fantastic choice!`,
        [Moods.MELODRAMATIC]: `With the weight of the world on my shoulders, I have chosen '${chosen}'. May history judge my decision with kindness.`
    };
    return { chosen, reasons };
}

export function getDebateTopic(): string {
    const topics: string[] = [
        "Is water wet?",
        "Is a hotdog a sandwich?",
        "Does a straw have one hole or two?",
        "If you replace a ship's planks one by one, is it still the same ship?",
        "Is cereal a soup?",
        "Should pineapple be on pizza?",
        "Which way should the toilet paper roll hang?",
    ];
    return topics[Math.floor(Math.random() * topics.length)];
}

export interface AvatarAnalysis {
    harmony: string;
    composition: string;
    memePotential: string;
    overall: string;
    commentary: Record<Moods, string>;
}

export function getAvatarAnalysis(user: User): AvatarAnalysis {
    const harmony = (parseInt(user.id.slice(-2)) + user.username.length) % 11;
    const composition = (parseInt(user.discriminator || '0001') * 3) % 11;
    const memePotential = (user.createdTimestamp % 100) % 11;
    return {
        harmony: `${harmony}/10`,
        composition: `${composition}/10`,
        memePotential: `${memePotential}/10`,
        overall: `A solid ${((harmony + composition + memePotential) / 3).toFixed(1)}/10.`,
        commentary: {
            [Moods.SASSY]: `It is... an image. Congratulations.`,
            [Moods.ENTHUSIASTIC]: `WOW! The way the pixels are arranged is JUST BEYOND AMAZING! A TRUE MASTERPIECE!`,
            [Moods.PHILOSOPHICAL]: `Does this arrangement of colors truly represent you? Or the idea of you? Fascinating.`,
            [Moods.MELODRAMATIC]: `This single image tells a story of hope, loss, and the indomitable human spirit. I'm weeping.`,
            [Moods.LITERAL]: `The image is ${user.avatarURL()?.includes('a_') ? 'animated' : 'static'}. It has pixels.`,
        }
    };
}

export function generateExcuse(): string {
    const subjects = ["My goldfish", "A rogue AI", "The ghost in my machine", "My smart toaster", "A flock of pigeons"];
    const verbs = ["stole my password", "rewrote my schedule", "spilled coffee on the server", "unionized against me", "sold my data for birdseed"];
    const consequences = ["and now I only speak in rhymes", "so I have to pay them in crypto", "which caused a temporal anomaly", "and they're demanding better benefits"];

    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    const consequence = consequences[Math.floor(Math.random() * consequences.length)];
    return `Sorry, ${subject} ${verb}, ${consequence}.`;
}

export interface Neologism {
    newWord: string;
    definition: string;
}

export function neologize(word: string): Neologism {
    if (!word || word.length < 3) {
        return { newWord: 'Womp-womp', definition: 'The sound of failure, especially in word creation.' };
    }
    const prefix = ['re-', 'un-', 'pro-', 'hyper-', 'ambi-'];
    const suffix = ['-ism', '-ation', '-esque', '-ify', '-oid'];

    const first = word.slice(0, 1);
    const last = word.slice(-1);
    const middle = word.slice(1, -1).split('').sort(() => 0.5 - Math.random()).join('');

    const newWord = `${prefix[Math.floor(Math.random() * prefix.length)]}${first}${middle}${last}${suffix[Math.floor(Math.random() * suffix.length)]}`;
    const definition = `(n.) The state of being similar to '${word}', but with more jazz hands and questionable life choices.`;

    return { newWord, definition };
}