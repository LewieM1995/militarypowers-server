const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateBattleReport(userProfile, enemyAIProfile, message, countryOneTotalPower, countryTwoTotalPower) {
  const chatGPTPrompt = `
    Generate a story based on the following outcome:
    ${JSON.stringify(userProfile.name)} vs ${JSON.stringify(enemyAIProfile.name)}(DON'T ADD QUOTES TO THE NAMES!)
    ${JSON.stringify(userProfile.profile.units)} vs ${JSON.stringify(enemyAIProfile.units)}
    ${countryOneTotalPower} vs ${countryTwoTotalPower} (Don't mention directy how much "POWER" each team has, just use it to determine the severity of the win or loss)
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
