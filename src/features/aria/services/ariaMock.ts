import type { AriaApiAdapter, AriaChatMessage, AriaUsage, SendMessagePayload, SendMessageResult } from './ariaApi';

let nextId = 100;

const seedHistory: AriaChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hi! I'm ARIA, your AI financial advisor. How can I help you today?",
    createdAt: new Date(Date.now() - 120_000).toISOString(),
  },
  {
    id: '2',
    role: 'user',
    content: "What's the best way to pay off my debts faster?",
    createdAt: new Date(Date.now() - 90_000).toISOString(),
  },
  {
    id: '3',
    role: 'assistant',
    content:
      "Great question! Two popular strategies are the **Avalanche** method (pay highest-interest debt first — saves the most money) and the **Snowball** method (pay smallest balance first — builds momentum). Based on your current debts, I'd recommend Avalanche — your credit card at 22.9% APR is costing you the most. Want me to model out both scenarios?",
    createdAt: new Date(Date.now() - 60_000).toISOString(),
  },
];

let mockHistory: AriaChatMessage[] = [...seedHistory];
let mockUsage: AriaUsage = { used: 3, limit: 50, resetsAt: new Date(Date.now() + 86_400_000 * 25).toISOString() };

const mockResponses = [
  "Based on your spending patterns, you could save an additional $340/month by reducing dining and subscription expenses.",
  "Your debt-to-income ratio is currently 28%, which is within the healthy range. Keep it below 36% to maintain strong financial health.",
  "I'd recommend building a 3-month emergency fund before aggressively paying down your student loans — it gives you a safety net.",
  "Your current savings rate is 12%. To retire comfortably at 65, aim for at least 15-20% of your gross income.",
  "Looking at your timeline, you'll be debt-free in approximately 2 years and 4 months at your current payoff rate.",
];

let responseIndex = 0;

export const ariaMock: AriaApiAdapter = {
  async getHistory() {
    await new Promise((r) => setTimeout(r, 300));
    return [...mockHistory];
  },

  async getUsage() {
    await new Promise((r) => setTimeout(r, 150));
    return { ...mockUsage };
  },

  async sendMessage(payload: SendMessagePayload): Promise<SendMessageResult> {
    await new Promise((r) => setTimeout(r, 800));

    const userMsg: AriaChatMessage = {
      id: String(++nextId),
      role: 'user',
      content: payload.content,
      createdAt: new Date().toISOString(),
    };

    const assistantMsg: AriaChatMessage = {
      id: String(++nextId),
      role: 'assistant',
      content: mockResponses[responseIndex % mockResponses.length],
      createdAt: new Date().toISOString(),
    };

    responseIndex++;
    mockHistory = [...mockHistory, userMsg, assistantMsg];
    mockUsage = { ...mockUsage, used: mockUsage.used + 1 };

    return { message: assistantMsg, usage: { ...mockUsage } };
  },
};
