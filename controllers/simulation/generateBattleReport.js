const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateBattleReport(userProfile, enemyAIProfile, message) {
  const chatGPTPrompt = `
    Generate a story style battle report based on the following outcome:
    - User's country name: ${JSON.stringify(userProfile.name)}.
    - ${JSON.stringify(userProfile.profile.units)} vs ${JSON.stringify(enemyAIProfile.units)}.
    - Enemy coutry name: ${JSON.stringify(enemyAIProfile.name)}: 
    - ${message}
  `;

  try {
    const chatGPTResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: chatGPTPrompt },
      ],
    });

    return chatGPTResponse.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating battle report:", error);
    throw error;
  }
}

module.exports = generateBattleReport;
