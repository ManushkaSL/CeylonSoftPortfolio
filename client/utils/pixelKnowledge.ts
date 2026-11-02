import { PixelEmotion } from "@/types/pixel";

export interface PixelKnowledge {
  name: string;
  developer: string;
  university: string;
  degree: string;
  skills: string[];
  projects: {
    title: string;
    type: string;
    desc: string;
    tech: string[];
  }[];
  contact: string;
}

export const PORTFOLIO_KNOWLEDGE: PixelKnowledge = {
  name: "Pixel",
  developer: "Manushka D. Dissanayake",
  university: "University of Jaffna",
  degree: "Computer Science Undergraduate",
  skills: [
    "React",
    "TypeScript",
    "Flutter",
    "Node.js",
    "Firebase",
    "Supabase",
    "PostgreSQL",
    "TailwindCSS",
    "REST APIs",
    "Vite",
  ],
  projects: [
    {
      title: "PulseSetter",
      type: "Client Project",
      desc: "Integrated healthcare & educational platform connecting patients, doctors, and students with online channeling and book marketplace.",
      tech: ["React", "Razorpay", "REST APIs", "HealthTech"],
    },
    {
      title: "Matrix Digital Solutions",
      type: "Client Project",
      desc: "Modern corporate portfolio website designed to showcase company services, brand identity, interactive animations, and client work.",
      tech: ["React", "TypeScript", "Vite", "Vercel"],
    },
    {
      title: "LAW.LK",
      type: "Client Project",
      desc: "Legal information & regulatory journal platform with statute publishing, user authentication, and nested community discussions.",
      tech: ["React", "TypeScript", "Firebase", "Firestore"],
    },
    {
      title: "TripShare & TripShare Mobile",
      type: "Personal Project",
      desc: "Shared tour booking platform and mobile app connecting passengers and drivers with tour discovery and live in-app chat.",
      tech: ["React", "Flutter", "Firebase", "OpenStreetMap"],
    },
    {
      title: "SC Courier & Rider App",
      type: "Academic Group Project",
      desc: "Logistics courier management system and mobile rider application with parcel tracking and automated reporting.",
      tech: ["React", "Flutter", "PostgreSQL", "REST APIs", "Maps"],
    },
  ],
  contact: "contact@ceylonsoft.com",
};

export const FIRST_VISIT_GREETING = "Ohhh, a visitor!! 👀✨";

export const DIZZY_MESSAGES = [
  "STOOOP! You're making me dizzy! 😵💫",
  "Whoa whoa WHOA! 🌀",
  "My eyes can't keep up! 😵",
  "The room is spinning! 💫",
  "Too fast for my tiny sensors! 🌀",
  "I need a tiny robot break! 😵💫",
  "Whooooosh! Slow down please! 💫",
];

export const ANGRY_MESSAGES = [
  "HEYYY! Are you hitting me?! 😤",
  "Stop poking meee! 😡",
  "My poor little circuits! 😭",
  "Excuse me! Personal pixel space! 🛑",
  "One more poke and I'm telling the motherboard! 🤖💥",
  "My visor is not a touch screen! 😤",
  "Ouch! Be gentle with the robot! 😠",
];

export const HAPPY_MESSAGES = [
  "Hehe, you're still here! 💚",
  "Ooh, this is fun! ✨",
  "Heyyy! Nice to see you! 🥹",
  "Yay! Loving the vibes! 🌟",
  "Bip-bop! You're awesome! 💚",
  "You're having fun, right? ✨",
];

export const CURIOUS_MESSAGES = [
  "Whatcha looking at? 👀",
  "Ooooh, interesting! 🤔",
  "Wait, what's that?! 🔍",
  "Exploring Manushka's work? 🧐",
  "Ooh, what are we clicking next? 👀",
];

export const SLEEPY_MESSAGES = [
  "Zzz... five more minutes! 😴",
  "My battery needs a nap... 💤",
  "Power saving mode activated... 🥱",
  "Yaaawn! Recharging my pixels... 💤",
];

export const EXCITED_MESSAGES = [
  "OOOH! Look at this! 🤩",
  "YAYYY! Another project! 🚀",
  "So much cool tech here! ⚡",
  "Look at that clean code! ✨",
];

export const PLAYFUL_MESSAGES = [
  "Hehe, caught you! 😜",
  "I seeee you! 👀",
  "Peek-a-boo! You can't hide! 🙈",
  "Bip-bop! You're pretty quick! ⚡",
];

export const THINKING_MESSAGES = [
  "Hmmmm... processing! 🤔",
  "My tiny brain is working! 🧠",
  "Calculating the awesomeness... ⚙️",
  "Analyzing modern tech stacks... 💡",
];

export const SECTION_GREETINGS: Record<number, { text: string; emotion: PixelEmotion }[]> = {
  0: [
    { text: "Welcome to Manushka's portfolio! 🚀✨", emotion: "excited" },
    { text: "Look at those dual cinematic spotlights! Neat, right? 🤩", emotion: "curious" },
    { text: "Hehe, I live here rent-free! 🤖💚", emotion: "happy" },
  ],
  1: [
    { text: "Ooh! Check out the Web & Mobile project deck! 🤩", emotion: "excited" },
    { text: "5 Web platforms and 2 Mobile apps built by Manushka! 💻📱", emotion: "happy" },
    { text: "PulseSetter and TripShare are my personal favorites! ✨", emotion: "playful" },
  ],
  2: [
    { text: "Want to know who's behind all this code? 👀", emotion: "curious" },
    { text: "Manushka is a CS undergrad @ University of Jaffna! 🎓✨", emotion: "happy" },
    { text: "He builds full-stack systems and mobile platforms! 💻⚡", emotion: "excited" },
  ],
  3: [
    { text: "Got an idea? Let's talk! 📬✨", emotion: "happy" },
    { text: "You can reach Manushka at contact@ceylonsoft.com! ✉️", emotion: "excited" },
    { text: "Ready to initiate a new project? Let's build! 🚀", emotion: "playful" },
  ],
};

export const FUN_FACTS = [
  "🎓 CS Undergrad @ University of Jaffna",
  "🎮 Passionate about Game & Interactive Tech",
  "⚡ Building Full-Stack Web & Mobile Systems",
  "💡 Loves turning bold ideas into reality",
];

export const SPONTANEOUS_FUN_FACTS: { text: string; emotion: PixelEmotion }[] = [
  { text: "Fun fact: JavaScript was created in just 10 days back in 1995! ⚡", emotion: "excited" },
  { text: "Did you know? The first computer bug was an actual moth in 1947! 🦋", emotion: "playful" },
  { text: "Did you know? Over 70% of modern web apps run on React! ⚛️", emotion: "happy" },
  { text: "Fun fact: Flutter lets you compile to iOS, Android & Web from one codebase! 📱", emotion: "curious" },
  { text: "Manushka loves game dev and creative interactive coding! 🎮✨", emotion: "excited" },
  { text: "Robots like me run on 100% recycled digital stardust! 🌟🤖", emotion: "playful" },
  { text: "Hehe, you're still here! Having fun exploring? 💚", emotion: "happy" },
  { text: "Whatcha looking at? Check out the project deck! 👀", emotion: "curious" },
];

export const TECH_JOKES: string[] = [
  "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
  "There are 10 types of people in the world: those who understand binary, and those who don't! 🤖",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?' 🍻",
  "Why do Java programmers have to wear glasses? Because they don't C#! 👓",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
];

// Smart fallback answer generator for the AI chat panel when backend API is unreachable or offline
export function generateLocalPixelReply(query: string): { message: string; emotion: PixelEmotion } {
  const q = query.toLowerCase().trim();

  // Jokes
  if (q.includes("joke") || q.includes("funny") || q.includes("laugh")) {
    const joke = TECH_JOKES[Math.floor(Math.random() * TECH_JOKES.length)];
    return { message: joke, emotion: "playful" };
  }

  // Who is developer / Manushka
  if (q.includes("who is") || q.includes("manushka") || q.includes("about") || q.includes("developer") || q.includes("author")) {
    return {
      message:
        "Hehe! Manushka D. Dissanayake is a CS undergrad at the University of Jaffna! He builds sleek full-stack web and mobile platforms! 🚀✨",
      emotion: "happy",
    };
  }

  // Skills & tech stack
  if (q.includes("skill") || q.includes("tech") || q.includes("stack") || q.includes("language") || q.includes("framework")) {
    return {
      message:
        "Ooh, his tech stack! He works with React, TypeScript, Flutter, Node.js, Firebase, PostgreSQL, and REST APIs! 💻⚡",
      emotion: "excited",
    };
  }

  // Mobile apps
  if (q.includes("mobile") || q.includes("flutter") || q.includes("android") || q.includes("ios") || q.includes("app")) {
    return {
      message:
        "Yes! Manushka creates mobile apps with Flutter — like TripShare Mobile and the SC Courier Rider App! 📱🚀",
      emotion: "excited",
    };
  }

  // Projects
  if (q.includes("project") || q.includes("pulsesetter") || q.includes("matrix") || q.includes("law") || q.includes("tripshare") || q.includes("courier")) {
    if (q.includes("pulsesetter")) {
      return {
        message:
          "PulseSetter is an integrated healthcare & education platform with doctor channeling and a medical book marketplace! 🩺✨",
        emotion: "excited",
      };
    }
    if (q.includes("matrix")) {
      return {
        message:
          "Matrix Digital Solutions is a sleek corporate portfolio website with modern animations and branding! 🌐💫",
        emotion: "happy",
      };
    }
    if (q.includes("law")) {
      return {
        message:
          "LAW.LK is a legal information portal with statute publishing and community discussion threads! ⚖️📚",
        emotion: "curious",
      };
    }
    return {
      message:
        "He's built 5 Web platforms and 2 Flutter mobile apps! Check out the 3D Projects deck to see them in action! 🤩✨",
      emotion: "happy",
    };
  }

  // Contact / hire / email
  if (q.includes("contact") || q.includes("email") || q.includes("hire") || q.includes("reach") || q.includes("message")) {
    return {
      message:
        "You can reach Manushka directly at contact@ceylonsoft.com or click 'INITIATE PROJECT'! 📬✨",
      emotion: "excited",
    };
  }

  // Fun fact
  if (q.includes("fact") || q.includes("fun") || q.includes("trivia")) {
    const fact = SPONTANEOUS_FUN_FACTS[Math.floor(Math.random() * SPONTANEOUS_FUN_FACTS.length)];
    return { message: fact.text, emotion: fact.emotion };
  }

  // Who are you / Pixel
  if (q.includes("who are you") || q.includes("your name") || q.includes("pixel") || q.includes("what are you")) {
    return {
      message:
        "Bip-bop! I'm Pixel! 🤖✨ Manushka's animated AI companion. Ask me anything about his work, skills, or projects!",
      emotion: "happy",
    };
  }

  // Default friendly reply
  return {
    message:
      "I'm all ears! 👀 Ask me about Manushka's projects (like PulseSetter or TripShare), his tech stack, or ask for a tech joke! 💡",
    emotion: "curious",
  };
}
