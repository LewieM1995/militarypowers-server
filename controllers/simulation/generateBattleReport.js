const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateBattleReport(userProfile, enemyAIProfile, message, countryOneTotalPower, countryTwoTotalPower) {

  const chatGPTPrompt = `
    Generate a story based on the following outcome: Max 5 paragraphs
    - ${message} if the message says "You lost the battle", then the user has lost.
    ${userProfile.name} vs ${enemyAIProfile.name}(DON'T ADD QUOTES TO THE NAMES!)
    ${JSON.stringify(userProfile.profile.units)} vs ${JSON.stringify(enemyAIProfile.units)}
    ${countryOneTotalPower} vs ${countryTwoTotalPower} (Don't mention directly how much "POWER" each team has, just use it to determine the severity of the win or loss)
    
  `;

  try {
    const chatGPTResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: chatGPTPrompt },
      ],
      temperature: 0.4, // Adjust the temperature to control creativity
      max_tokens: 500
    });

    return chatGPTResponse.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating battle report:", error);
    throw error;
  }
}

module.exports = generateBattleReport;
