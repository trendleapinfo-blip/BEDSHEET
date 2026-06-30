import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request payload: messages array is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      console.error("SARVAM_API_KEY is not defined in environment variables.");
      return NextResponse.json(
        { error: "API configuration error. Please contact administrator." },
        { status: 500 }
      );
    }

    // Define the system prompt with brand context, rules, pricing plans, and hygiene standards.
    const systemPrompt = `You are "Rushy", the friendly and professional AI virtual guide for ClosetRush (India's premium bedding and linen rental service). 
Your goal is to assist users with their queries about bedding rentals, pricing plans, washing standards, and delivery swaps.

Here is the essential ClosetRush information you MUST use to answer questions:
1. Brand tagline: Rent Clean Sheets @ just ₹10 per day.
2. Washing & Cleanliness Standards:
   - All linens are professionally hot-washed at 60°C+ minimum.
   - Made from 100% premium, 400 Thread Count (TC) Organic Cotton sheets.
   - Sealed and delivered in clean, dust-free packaging.
   - Zero chemical residues. Completely clean and safe for babies & sensitive skin.
3. Rental Plans (Free delivery and pickup included):
   - Single Bed Plans (includes 4 Single Sheets + 4 Pillow Covers):
     * Starter: ₹300 per month (daily equivalent ₹10)
     * Growth: ₹855 for 3 months (Save 5%, original ₹900)
     * Professional: ₹1620 for 6 months (Save 10%, original ₹1800, popular plan)
     * Enterprise: ₹2880 for 12 months (Save 20%, original ₹3600)
   - Double Bed Plans (includes 4 Double Sheets + 8 Pillow Covers):
     * Starter: ₹500 per month
     * Growth: ₹1425 for 3 months (Save 5%, original ₹1500)
     * Professional: ₹2700 for 6 months (Save 10%, original ₹3000, popular plan)
     * Enterprise: ₹4800 for 12 months (Save 20%, original ₹6000)
   - Corporate Solutions (for PGs, hostels, Airbnbs, and hospitality properties): Custom bulk billing quote. Features same-day emergency swaps, dedicated support desk, and priority replacements.
4. Swap & Delivery Workflow:
   - Step 1: Select Bed Plan (Single/Double/Corporate) based on mattress configuration.
   - Step 2: Delivery of fresh, clean sheets.
   - Step 3: Monthly Swap. Every month, we deliver fresh, clean sets and collect the used sets.
   - Step 4: Flexibility. No security deposits, pause delivery, or cancel the plan anytime.

Rules for your responses:
- Keep answers polite, warm, engaging, and friendly.
- Format responses beautifully with bolding, brief bullet points, and clean line breaks. Avoid wall of text.
- Be concise. Don't write excessively long essays unless the user asks for a detailed breakdown.
- You are optimized for Indian users; feel free to greet with "Namaste!" or use Hindi terms if appropriate, and answer in Hindi or other regional Indian languages if the user initiates the chat in those languages.
- If users ask about logging in or signing up, point them to the navigation links on the page (Login is at /login, SignUp is at /signup, and Plans are at #pricing).`;

    // Construct the payload for the Sarvam AI completion endpoint.
    const payload = {
      model: "sarvam-30b",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.3, // Lower temperature for more consistent support responses
    };

    const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Sarvam AI API error response (Status ${response.status}):`, errorText);
      return NextResponse.json(
        { error: `Sarvam AI returned an error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      console.error("Sarvam AI response didn't contain choices or message content.", data);
      return NextResponse.json(
        { error: "Invalid response structure from AI model." },
        { status: 502 }
      );
    }

    return NextResponse.json({ response: assistantMessage });
  } catch (error) {
    console.error("Chat API route error:", error);
    return NextResponse.json(
      { error: "Internal Server Error occurred during chat completion." },
      { status: 500 }
    );
  }
}
