export interface KickassHype {
  tagline: string;
  kickassDescription: string;
  keyMarkers: { label: string; value: string }[];
}

export const KICKASS_ARCHETYPE_DESCRIPTIONS: Record<string, { tagline: string; kickass: string }> = {
  ESTJ: {
    tagline: "The Ruthless Execution Machine",
    kickass: "A human Swiss Army knife of lethal efficiency. While everyone else is busy scheduling a meeting to plan the meeting, you've already color-coded the spreadsheet, restructured the supply chain, resolved three crises before lunch, and established absolute order in the galaxy."
  },
  ENTJ: {
    tagline: "The Unstoppable Sovereign",
    kickass: "Born with the deep metaphysical certainty that the universe is just waiting for your strategic overhaul. You don't just achieve goals; you execute 5-year plans in 5 weeks and leave competitors frantically checking the rulebook."
  },
  INTJ: {
    tagline: "The 4D Grandmaster",
    kickass: "Playing 4D chess while the rest of humanity is stuck playing tic-tac-toe. You've simulated every possible scenario since 2012, designed contingency plans for the apocalypse, and quietly know how every story ends before the opening scene."
  },
  INTP: {
    tagline: "The Quantum Supercomputer",
    kickass: "A walking cognitive singularity fueled by curiosity and caffeine. You can deconstruct an impossible theoretical paradox in your sleep, dismantle entire paradigms before breakfast, and rewrite logic while forgetting where you put your phone."
  },
  ENTP: {
    tagline: "The Paradigm Demolition Crew",
    kickass: "A walking firework show of relentless intellectual chaos. You can win an argument from both sides simultaneously just for sport, invent three disruptive startups on a napkin, and turn existential chaos into pure creative gold."
  },
  INFJ: {
    tagline: "The Psychic Laser Beam",
    kickass: "A clairvoyant radar disguised as a calm human. You decode someone's entire psychological backstory within 3 seconds, predict societal shifts decades in advance, and quietly bend the universe toward cosmic harmony."
  },
  INFP: {
    tagline: "The Unbreakable Idealist",
    kickass: "Possessing a supernova imagination and a core of pure titanium. You channel deep emotional truth into transcendent creative work, stand up against impossible odds with quiet courage, and protect authenticity like a sacred flame."
  },
  ENFJ: {
    tagline: "The Magnetic Catalyst",
    kickass: "Pure emotional alchemy on two legs. You can walk into a room full of divided strangers and have them uniting behind a shared utopian mission within 15 minutes. A natural leader who makes everyone feel invincible."
  },
  ENFP: {
    tagline: "The Cosmic Sparkplug",
    kickass: "An infinite generator of visionary enthusiasm and infectious momentum. You connect abstract dots nobody else can see, turn wild dreams into viral reality, and make achieving the impossible look like a casual Tuesday afternoon."
  },
  ISTJ: {
    tagline: "The Bedrock of Civilization",
    kickass: "Completely bulletproof under pressure. When the world is on fire and panic sets in, you calmly step in, open the SOP, fix the broken infrastructure, and restore peace before anyone else even understands what went wrong."
  },
  ISFJ: {
    tagline: "The Indomitable Guardian",
    kickass: "Quietly running the world with a memory like an encrypted vault and loyalty forged from tungsten steel. You catch every subtle detail, hold communities together through storms, and protect your inner circle with fierce dedication."
  },
  ESFJ: {
    tagline: "The Social Architect",
    kickass: "The ultimate orchestrator of human momentum and community magic. You know every connection, anticipate every need before it's spoken, and command networks with radiant warmth and unstoppable tactical precision."
  },
  ISTP: {
    tagline: "The Surgical Problem Assassin",
    kickass: "Cold-blooded mechanical brilliance. You don't panic, you troubleshoot. Whether it's complex code, an emergency crisis, or broken mechanics, you diagnose the flaw, fix it with surgical precision, and walk away looking effortless."
  },
  ISFP: {
    tagline: "The Aesthetic Maverick",
    kickass: "Raw authentic grace and effortless swagger. You don't follow trends; you define the aesthetic baseline. Unfiltered, fiercely independent, and gifted with creative instincts that strike with effortless perfection."
  },
  ESTP: {
    tagline: "The Kinetic Dynamo",
    kickass: "Zero hesitation, 100% velocity. You thrive in chaotic battlegrounds where others freeze up, seizing high-stakes opportunities with lightning reflexes and turning high-wire risks into legendary victories."
  },
  ESFP: {
    tagline: "The Starfire Luminary",
    kickass: "The radiant pulse of the room and an unstoppable force of charisma. You transform mundane moments into unforgettable experiences, read social dynamics in real time, and illuminate every space with pure, unfiltered star power."
  }
};

export function getKickassProfile(archetypeCode: string, isAssertive: boolean = true) {
  const code = (archetypeCode || 'INTJ').toUpperCase().substring(0, 4);
  const data = KICKASS_ARCHETYPE_DESCRIPTIONS[code] || {
    tagline: "The High-Velocity Catalyst",
    kickass: "A masterclass in psychometric synergy. Combining exceptional cognitive agility with razor-sharp execution, you turn complex challenges into effortless triumphs."
  };

  return {
    tagline: isAssertive ? `${data.tagline} (Assertive)` : `${data.tagline} (Turbulent)`,
    description: data.kickass
  };
}
