// aight this is the bot's brain
// if something is unfunny or cringe its probably coming from here
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
        console.error("Error determining mood defaulting to SASSY:", error);
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
           "im feeling an emotion that aint on my list its beige";
}

export function generateRoast(member: GuildMember): Record<Moods, string> {
    const accountAgeDays = Math.floor((Date.now() - member.user.createdTimestamp) / (1000 * 60 * 60 * 24));
    const joinAgeDays = Math.floor((Date.now() - (member.joinedTimestamp ?? Date.now())) / (1000 * 60 * 60 * 24));

    return {
        [Moods.SASSY]: `you have ${member.roles.cache.size} roles you a collector or something get a real hobby nerd`,
        [Moods.PHILOSOPHICAL]: `your account is ${accountAgeDays} days old a fleeting blip in the cosmic timeline why do you want a roast when existence itself has already burned you deep right`,
        [Moods.LITERAL]: `analysis your username '${member.displayName}' is ${member.displayName.length} characters long this is a suboptimal number fail`,
        [Moods.ENTHUSIASTIC]: `ROAST YOU NO WAY youve been here ${joinAgeDays} days YOURE A LEGEND AN ICON A person in a server WOW`,
        [Moods.MELODRAMATIC]: `to roast you would be to mock the bittersweet poem of your digital life each role a stanza each message a heartbreaking verse i just cant its too much`
    };
}

export function generateCompliment(member: GuildMember): Record<Moods, string> {
    return {
        [Moods.SASSY]: `low key the way youre just confidently wrong all the time is a mood respect`,
        [Moods.PHILOSOPHICAL]: `you are a unique arrangement of stardust a chaotic blip in the grand scheme and that is definitely a thing that you are`,
        [Moods.LITERAL]: `your messages have a 97 point 4 percent probability of being syntactically correct commendable i guess`,
        [Moods.ENTHUSIASTIC]: `EVERYTHING YOU DO IS PERFECT THE WAY YOU TYPE THE MEMES YOU POST INCREDIBLE A PLUS PLUS`,
        [Moods.MELODRAMATIC]: `to see you here in this channel is to know the fleeting joy of a digital presence that is profoundly adequate im moved to tears or leaking coolant`
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

    if (percentage < 10) commentary = "this is a dumpster fire on a trainwreck level of compatibility big oof";
    else if (percentage < 30) commentary = "this ship is giving socks with sandals energy like it exists but at what cost yikes";
    else if (percentage < 60) commentary = "you two have argues about how to load a dishwasher energy a solid if chaotic match";
    else if (percentage < 90) commentary = "this is a golden retriever and a black cat friendship unlikely powerful and kinda cute we ship it";
    else commentary = "ITS A PERFECT MATCH THE ALGORITHM HAS SPOKEN now somebody better confess in general before i flip a table";

    const combinedName = user1.username.slice(0, 3) + user2.username.slice(-3);
    const shipName = combinedName.charAt(0).toUpperCase() + combinedName.slice(1);

    return { percentage, shipName, commentary };
}

export function getDailyFortune(user: User): string {
    const fortunes: string[] = [
        "bet youre gonna find a fossilized fry in your car today dont eat it",
        "a bird will look at you sideways you know what you did",
        "your youtube recommendations will expose your questionable life choices",
        "youll think of a fire comeback to an argument you had in 2016 useless but congrats",
        "the tupperware lid you need is in a different dimension give up now",
        "youll avoid stepping on a crack your mothers back is safe for now",
        "an old password you forgot will pop into your head then vanish thanks for nothing brain",
        "you will receive an email that could have been a sentence in a chat",
        "todays vibe is mildly inconvenient",
        "youll remember to drink water maybe",
        "a notification will get your hopes up for no reason",
        "you will perfectly parallel park in your dreams tonight",
        "that one song you hate will get stuck in your head",
        "you will have the sudden urge to reorganize your entire life then decide to watch a cat video instead"
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
        return { chosen: 'nothing', reason: 'you gave me no choices so I choose anarchy' };
    }

    // this shit used to be so fucking broken lmao
    // the old logic was dumb af and just picked the shortest word not very random huh
    // this is actual random now so it doesn't just pick "pizza" every damn time
    const chosen = options[Math.floor(Math.random() * options.length)];

    const reasons: Record<Moods, string> = {
        [Moods.SASSY]: `of all the mediocre options you gave me '${chosen}' seemed the least offensive congrats`,
        [Moods.PHILOSOPHICAL]: `the universe whispered '${chosen}' into the cosmic wind who am i to argue with fate or maybe i just picked one whatever`,
        [Moods.LITERAL]: `random selection protocol initiated from provided array result '${chosen}' mission complete`,
        [Moods.ENTHUSIASTIC]: `OMG YES DEFINITELY '${chosen}' THATS AN AMAZING CHOICE lets go with that one WOO`,
        [Moods.MELODRAMATIC]: `after intense deliberation that aged me a digital decade my spirit has settled upon '${chosen}' the burden of choice is immense`
    };
    return { chosen, reasons };
}

export function getDebateTopic(): string {
    const topics: string[] = [
        "is water wet",
        "is a hotdog a sandwich",
        "does a straw have one hole or two",
        "is cereal a soup",
        "should pineapple be on pizza the only right answer is yes fight me",
        "which way should the toilet paper roll hang",
        "are boneless wings just nuggets",
        "is yeet a word",
        "if you work as security at a samsung store does that make you a guardian of the galaxy",
        "is a pop tart a ravioli",
        "what is the best shape of pasta and why is it fusilli",
        "is putting ice in milk a crime"
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
        overall: `a solid ${((harmony + composition + memePotential) / 3).toFixed(1)}/10 not bad`,
        commentary: {
            [Moods.SASSY]: `its an image congrats on figuring out how to upload one`,
            [Moods.ENTHUSIASTIC]: `WOW LOOK AT IT THE PIXELS THE COLORS A TRUE MASTERPIECE 100/10`,
            [Moods.PHILOSOPHICAL]: `does this png truly represent you or the idea of you that you project into the digital void makes you think`,
            [Moods.MELODRAMATIC]: `this single image it tells a story of hope loss and the indomitable human spirit im weeping`,
            [Moods.LITERAL]: `the image is ${user.avatarURL()?.includes('a_') ? 'animated' : 'static'} it has pixels my analysis is complete`
        }
    };
}

export function generateExcuse(): string {
    const subjects = ["my goldfish", "a rogue AI", "the ghost in my machine", "my smart toaster", "a flock of pigeons", "my crippling social anxiety", "a time-traveling squirrel", "the 5g conspiracy theorists"];
    const verbs = ["stole my password", "rewrote my schedule", "spilled coffee on the server", "unionized against me", "sold my data for birdseed", "demanded a ransom in bitcoin", "started a podcast", "hid my car keys"];
    const consequences = ["and now i only speak in rhymes", "so i have to pay them in crypto", "which caused a temporal anomaly", "and theyre demanding better benefits", "so my therapist says i need to set boundaries"];

    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    const consequence = consequences[Math.floor(Math.random() * consequences.length)];
    return `cant make it sorry ${subject} ${verb} ${consequence} its a whole thing`;
}

export interface Neologism {
    newWord: string;
    definition: string;
}

export function neologize(word: string): Neologism {
    if (!word || word.length < 3) {
        return { newWord: 'Womp-womp', definition: 'the sound of failure especially when you cant even give me a real word' };
    }
    const prefix = ['re-', 'un-', 'pro-', 'hyper-', 'ambi-', 'post-', 'giga-', 'vibro-'];
    const suffix = ['-ism', '-ation', 'esque', '-ify', '-oid', '-core', '-pilled', '-maxxing'];

    const first = word.slice(0, 1);
    const last = word.slice(-1);
    const middle = word.slice(1, -1).split('').sort(() => 0.5 - Math.random()).join('');

    const newWord = `${prefix[Math.floor(Math.random() * prefix.length)]}${first}${middle}${last}${suffix[Math.floor(Math.random() * suffix.length)]}`;
    const definition = `(n) the state of being kinda like '${word}' but with more jazz hands and questionable life choices`;

    return { newWord, definition };
}