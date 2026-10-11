// ============================================================
// Account / monetization config.
// After deploying the PHP backend, set ACCOUNT_API_BASE_URL to
// your backend URL (e.g. "https://example.com/api-backend").
// While it is empty, account features stay disabled and the app
// works exactly as before (no login gate, no token deduction).
// ============================================================

export const ACCOUNT_API_BASE_URL = "https://weaponhost.in";

export const GOOGLE_WEB_CLIENT_ID =
  "366420566057-aaho7rppppt6nrgs11phmuuontcjgtqf.apps.googleusercontent.com";

// Tokens charged per AI message sent.
export const TOKENS_PER_MESSAGE = 1;

export function isAccountEnabled(): boolean {
  return ACCOUNT_API_BASE_URL.trim().length > 0;
}

export type PlanId = "free" | "plus" | "premium";

export type Plan = {
  id: PlanId;
  name: string;
  price: string;
  tokens: string;
  features: string[];
  highlight?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    tokens: "100 tokens",
    features: ["100 AI tokens on signup", "All chat features", "Community support"],
  },
  {
    id: "plus",
    name: "Plus",
    price: "₹99/month",
    tokens: "1,000 tokens/month",
    features: ["1,000 AI tokens every month", "Priority responses", "Email support"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "₹199/month",
    tokens: "Unlimited tokens",
    features: ["Unlimited AI tokens", "Fastest responses", "Priority support"],
    highlight: true,
  },
];
