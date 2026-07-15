import type { StoryChapterId } from "./story";

export type StoryCopyBeat = {
  progress: number;
  title: string;
  body: string;
};

export const storyCopy: Record<StoryChapterId, StoryCopyBeat[]> = {
  garage: [
    {
      progress: 0,
      title: "Heavy-duty. Small engines. Real work.",
      body: "Oakenwrench Mechanical · Calgary, Alberta",
    },
    {
      progress: 0.25,
      title: "The shop wakes up.",
      body: "Scroll to raise the door and step into the work.",
    },
    {
      progress: 0.5,
      title: "Built for hard-working machines.",
      body: "Licensed heavy-duty and small-engine mechanic.",
    },
    {
      progress: 0.75,
      title: "Come inside.",
      body: "A compact Calgary workshop with broad capability.",
    },
    {
      progress: 1,
      title: "This is where the work happens.",
      body: "Automotive, diagnostics and major mechanical repair.",
    },
  ],
  truck: [
    {
      progress: 0,
      title: "Heavy-duty / automotive",
      body: "Pickup service, diagnostics and major mechanical work.",
    },
    {
      progress: 0.25,
      title: "Find the problem.",
      body: "Practical diagnostics before parts and labour.",
    },
    {
      progress: 0.5,
      title: "Open it up.",
      body: "Engine, brakes, suspension and the jobs that run deep.",
    },
    {
      progress: 0.75,
      title: "Repair with intent.",
      body: "Real tools, real parts, no showroom theatre.",
    },
    {
      progress: 1,
      title: "Big jobs. Small jobs.",
      body: "The same attention carries across the whole shop.",
    },
  ],
  equipment: [
    {
      progress: 0,
      title: "Small engines. Full attention.",
      body: "The detail matters whether it drives or works the yard.",
    },
    {
      progress: 0.25,
      title: "Seasonal equipment",
      body: "Snowblowers and the machines Calgary counts on.",
    },
    {
      progress: 0.5,
      title: "Landscaping equipment",
      body: "Mowers, blowers, trimmers and commercial yard tools.",
    },
    {
      progress: 0.75,
      title: "Compact equipment",
      body: "Tracked loaders and the machinery behind the job.",
    },
    {
      progress: 1,
      title: "If it works hard, it deserves a proper fix.",
      body: "Maintenance, repair and mechanical problem-solving.",
    },
  ],
  contact: [
    {
      progress: 0,
      title: "Let’s get it fixed.",
      body: "Tell Dave what the machine is doing — or what it stopped doing.",
    },
    {
      progress: 0.25,
      title: "Licensed. Local. Ready to help.",
      body: "Heavy-duty and small-engine experience in Calgary.",
    },
    {
      progress: 0.5,
      title: "Call Dave",
      body: "The fastest way to check availability and the right next step.",
    },
    {
      progress: 0.75,
      title: "One tap from the shop.",
      body: "Call, WhatsApp, Messenger or email.",
    },
    {
      progress: 1,
      title: "Oakenwrench Mechanical",
      body: "Calgary, Alberta · Call for shop address.",
    },
  ],
};
