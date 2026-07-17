export type Tool = {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
};

export const tools: Tool[] = [
  { id: 1, name: "True Hourly Rate Calculator", slug: "true-hourly-rate", category: "💰 Money & Freelance", description: "See what you actually earn once taxes, gaps, and downtime are counted." },
  { id: 2, name: "Subscription Creep Tracker", slug: "subscription-tracker", category: "💰 Money & Freelance", description: "Add up every recurring charge and catch the ones you forgot about." },
  { id: 3, name: "Meeting Cost Calculator", slug: "meeting-cost", category: "💰 Money & Freelance", description: "Turn attendee salaries and meeting length into a real dollar cost." },
  { id: 4, name: "Raise / Promotion Real-Impact Calculator", slug: "raise-calculator", category: "💰 Money & Freelance", description: "Check what a raise is really worth after tax brackets and inflation." },
  { id: 5, name: "Debt Payoff Visualizer", slug: "debt-payoff", category: "💰 Money & Freelance", description: "Compare snowball vs. avalanche and see your real payoff date." },
  { id: 6, name: "Cost-Per-Use Decision Calculator", slug: "cost-per-use", category: "💰 Money & Freelance", description: "Find out if that purchase is actually worth the price tag." },
  { id: 7, name: "Commute Cost & Time Reality Check", slug: "commute-cost", category: "💰 Money & Freelance", description: "See what your commute really costs in time, fuel, and wear." },
  { id: 8, name: "Fair Meeting Time Rotator", slug: "meeting-time-rotator", category: "⏱️ Time & Remote Work", description: "Rotate awkward meeting times fairly across every time zone." },
  { id: 9, name: "Async Reply-Time Expectation Generator", slug: "reply-time-generator", category: "⏱️ Time & Remote Work", description: "Set clear response-time norms for your remote team." },
  { id: 10, name: "Screen Time Cost Converter", slug: "screen-time-cost", category: "⏱️ Time & Remote Work", description: "Turn your screen time into hours, days, and dollars lost." },
  { id: 11, name: "Focus Session Value Ticker", slug: "focus-session-ticker", category: "⏱️ Time & Remote Work", description: "Watch the dollar value of your focus time tick up live." },
  { id: 12, name: "Life-in-Weeks Visualizer", slug: "life-in-weeks", category: "⏱️ Time & Remote Work", description: "See your whole life mapped out, one box per week." },
  { id: 13, name: "Itemized Bill Splitter", slug: "bill-splitter", category: "🛠️ Everyday Practical", description: "Split a shared bill fairly, item by item, not just evenly." },
  { id: 14, name: "Paint & Wallpaper Estimator", slug: "paint-estimator", category: "🛠️ Everyday Practical", description: "Get exact paint or wallpaper quantities for any room." },
  { id: 15, name: "Recipe Scaler with Pan-Size Adjustment", slug: "recipe-scaler", category: "🛠️ Everyday Practical", description: "Scale any recipe up or down for a different pan size." },
  { id: 16, name: "Leftover / Fridge Food-Safety Countdown", slug: "food-safety-countdown", category: "🛠️ Everyday Practical", description: "Track how long your leftovers are still safe to eat." },
  { id: 17, name: "Luggage Weight Balancer", slug: "luggage-balancer", category: "🛠️ Everyday Practical", description: "Balance weight across bags before your airline charges you." },
  { id: 18, name: "Group Gift Contribution Splitter", slug: "gift-splitter", category: "🛠️ Everyday Practical", description: "Split a group gift fairly based on who can pay what." },
  { id: 19, name: "Multi-Platform Post Length Previewer", slug: "post-length-preview", category: "📱 Content & Social", description: "Preview how your post looks and where it gets cut off." },
  { id: 20, name: "Alt-Text Quality Checker", slug: "alt-text-checker", category: "📱 Content & Social", description: "Check if your image alt text actually helps people." },
  { id: 21, name: "Hashtag CamelCase Formatter", slug: "hashtag-formatter", category: "📱 Content & Social", description: "Format hashtags in CamelCase so screen readers read them right." },
  { id: 22, name: "Password Weakness Explainer", slug: "password-checker", category: "📱 Content & Social", description: "See exactly why a password is weak, not just a score." },
  { id: 31, name: "Warranty & Return-Window Tracker", slug: "warranty-tracker", category: "🛠️ Everyday Practical", description: "Track warranty and return deadlines before they quietly expire." },
  { id: 32, name: "Flight Layover Buffer Checker", slug: "layover-checker", category: "🛠️ Everyday Practical", description: "Check if your layover leaves enough buffer to connect safely." },
  { id: 33, name: "Rent vs Buy Break-Even Calculator", slug: "rent-vs-buy", category: "💰 Money & Freelance", description: "Find the year renting starts costing more than buying." },
  { id: 36, name: "Freelance Late-Payment Interest Calculator", slug: "late-payment-interest", category: "💰 Money & Freelance", description: "Calculate interest owed on a client's overdue invoice." },
  { id: 38, name: "Tuition Fee Refund Proration Calculator", slug: "fee-refund", category: "🛠️ Everyday Practical", description: "Work out your prorated refund after withdrawing." },
  { id: 40, name: "Used-Item Fair Resale Price Estimator", slug: "resale-price", category: "💰 Money & Freelance", description: "Get a fair resale price based on age and condition." },
  { id: 45, name: "Interactive Birthday Wisher & Card Generator", slug: "birthday-wisher", category: "🎉 Interactive Fun", description: "Create and share a personalized birthday card in seconds." },
  { id: 46, name: "Appliance Electricity Cost & Comparison Calculator", slug: "appliance-calculator", category: "🛠️ Everyday Practical", description: "Compare the electricity consumption and running cost of any two appliances." },
  { id: 47, name: "Freelance Payout Leakage Calculator", slug: "freelance-payout-leakage", category: "💰 Money & Freelance", description: "See exactly how much of your invoice disappears to platform cuts, withdrawal fees, and bad exchange rates before it lands in your account." },
  { id: 48, name: "Invoice Cash-Runway Calculator", slug: "invoice-cash-runway", category: "💰 Money & Freelance", description: "See how many days of runway you actually have based on which pending invoices are likely to pay on time." },
  { id: 49, name: "Notification Interruption Cost Calculator", slug: "notification-cost", category: "⏱️ Time & Remote Work", description: "Turn your daily pings and Slack messages into the real hours of focus they're quietly costing you." },
  { id: 50, name: "Unused Leave Forfeiture Calculator", slug: "leave-forfeiture", category: "⏱️ Time & Remote Work", description: "See the cash value of the PTO days you're about to lose to 'use it or lose it'." },
  { id: 51, name: "Grocery Unit-Price Comparator", slug: "grocery-unit-comparator", category: "🛠️ Everyday Practical", description: "Compare true cost per 100g/ml across pack sizes so 'bigger = cheaper' stops fooling you." },
  { id: 52, name: "Moving Day True-Cost Estimator", slug: "moving-cost-estimator", category: "🛠️ Everyday Practical", description: "Add up every hidden relocation cost people forget until the bill arrives." },
  { id: 53, name: "Appliance Upgrade Payback Calculator", slug: "appliance-upgrade-payback", category: "🛠️ Everyday Practical", description: "Find out exactly how many months until a pricier, efficient appliance pays for itself." },
  { id: 55, name: "Sponsored Post Rate Fairness Calculator", slug: "sponsored-post-rate", category: "📱 Content & Social", description: "Get a fair ballpark rate from real engagement, not just follower count." },
  { id: 59, name: "DST Drift Watchdog", slug: "dst-drift-watchdog", category: "⏱️ Time & Remote Work", description: "Find out exactly which weeks your recurring meetings will silently shift because of different DST transition dates." },
  { id: 60, name: "Notice-Period Deadline Extractor", slug: "notice-period-extractor", category: "🛠️ Everyday Practical", description: "Calculate the exact drop-dead date you must send your cancellation by based on your contract's fine print." },
  { id: 61, name: "Multi-Prescription Refill Sync", slug: "prescription-refill-sync", category: "🛠️ Everyday Practical", description: "Stop making five separate pharmacy trips. Find the single best day to request all refills together." },
  { id: 62, name: "Warranty Vault & Expiry Math", slug: "warranty-vault", category: "🛠️ Everyday Practical", description: "Calculate exactly when your warranty expires and keep the receipt attached securely in your browser." },
  { id: 63, name: "Deposit Dispute Shield", slug: "deposit-dispute-shield", category: "🛠️ Everyday Practical", description: "Generate an irrefutable report with cryptographic hashes to prove rental condition photos haven't been tampered with." },
  { id: 64, name: "Wedding Vendor Cascade Timeline", slug: "wedding-vendor-timeline", category: "🛠️ Business & Operations", description: "Lock an anchor event and instantly cascade exact arrival and setup times to every vendor when delays happen." },
  { id: 65, name: "Cottage Food Label Generator", slug: "cottage-food-label", category: "🛠️ Business & Operations", description: "Generate an FDA-compliant nutrition panel using deterministic USDA data math—no AI guesses." },
  { id: 66, name: "Small Farm Cost-Per-Yield Ledger", slug: "farm-yield-ledger", category: "🛠️ Business & Operations", description: "Calculate your exact breakeven cost-per-unit-yield to generate a lender-ready financial snapshot." },
  { id: 67, name: "Word-Count Auto-Invoicer", slug: "freelance-word-invoicer", category: "💰 Money & Freelance", description: "Paste text or upload a file to instantly count words deterministically and generate a ready-to-print invoice." },
  { id: 68, name: "Scope-Creep Ledger", slug: "scope-creep-ledger", category: "💰 Money & Freelance", description: "Log your actual hours against the signed SOW and instantly see the exact mathematical dollar value of your client's scope creep." },
  { id: 69, name: "Recurring-Cost Reconciler", slug: "recurring-cost-reconciler", category: "📱 Content & Social", description: "Tracks infinite recurring shared costs with running balances to mathematically flag who is riding on the group's dime." },
  { id: 70, name: "True-Overlap Trip Scheduler", slug: "true-overlap-trip", category: "📱 Content & Social", description: "Everyone inputs availability in local time; we calculate the exact overlapping window flawlessly handling DST offsets." },
  { id: 71, name: "Blind Duplicate-Proof Gift Registry", slug: "duplicate-gift-registry", category: "📱 Content & Social", description: "A P2P registry where claiming a gift mathematically erases it from the link you pass to the next person." },
  { id: 72, name: "Cooling-Off Send Delay", slug: "cooling-off-delay", category: "📱 Content & Social", description: "Lock your angry text in a vault until a countdown expires, physically preventing you from sending impulsively." },
  { id: 73, name: "Cross-Platform Mention Consolidator", slug: "mention-consolidator", category: "📱 Content & Social", description: "Deterministically generates advanced boolean queries to hunt untagged mentions without paying for a social listening API." },
  { id: 74, name: "Server Downtime SLA Refund Calculator", slug: "sla-refund-calculator", category: "🛠️ Business & Operations", description: "Input exact downtime to see mathematically how much Service Credit AWS or GCP owes you." },
  { id: 75, name: "App Store Fee Leakage Modeler", slug: "app-store-fee-modeler", category: "🛠️ Business & Operations", description: "Calculate exact true margin after Apple deducts local VAT/GST and takes their 15% or 30% cut." },
  { id: 76, name: "Cloud Egress Cost Simulator", slug: "cloud-egress-simulator", category: "🛠️ Business & Operations", description: "Compute exact mathematical egress penalties on AWS vs GCP vs Cloudflare based on tiered pricing." },
  { id: 77, name: "Open-Source License Conflict Checker", slug: "license-conflict-checker", category: "🛠️ Developer Tools", description: "Run a deterministic matrix check against copyleft licenses like GPL and AGPL to prevent compliance disasters." },
  { id: 78, name: "Strict WCAG Contrast Math", slug: "strict-contrast-checker", category: "🛠️ Developer Tools", description: "Calculate the exact WCAG 2.1 Relative Luminance ratio to ensure strict accessibility compliance." },
  { id: 79, name: "Remaining Parent Visits Calculator", slug: "parent-visits-calculator", category: "⏳ Life & Existential Math", description: "A stark mathematical reality check of exactly how many physical visits you have left based on actuarial life expectancy." },
  { id: 80, name: "True Hourly Wage Commute Depreciator", slug: "true-hourly-wage", category: "⏳ Life & Existential Math", description: "Calculate your actual hourly wage after backing out unpaid commute hours and IRS mileage vehicle depreciation." },
  { id: 81, name: "The 'One More Year' Syndrome Calculator", slug: "one-more-year-calculator", category: "⏳ Life & Existential Math", description: "See exactly how much your safe withdrawal rate drops if you work one more year, turning anxiety into a hard number." },
  { id: 82, name: "Hobby Cost-Per-Hour Rationalizer", slug: "hobby-cost-rationalizer", category: "⏳ Life & Existential Math", description: "Amortize the cost of expensive gear against the hours of joy you get vs the cost of a movie ticket." },
  { id: 83, name: "Personal Inflation Tracker", slug: "personal-inflation-tracker", category: "⏳ Life & Existential Math", description: "Input the exact items you buy to see your true personal inflation rate, bypassing generic government CPI." },
];

export const categories = [...new Set(tools.map((t) => t.category))];

export function getCategoryLabel(cat: string) {
  const spaceIdx = cat.indexOf(" ");
  return { icon: cat.slice(0, spaceIdx), label: cat.slice(spaceIdx + 1) };
}

export function getCategorySlug(cat: string) {
  const { label } = getCategoryLabel(cat);
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
