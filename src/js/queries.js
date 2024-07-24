const dotenv = require("dotenv");
dotenv.config();


async function getAIResponse(userInput) {
  const endpoint = 'http://localhost:5000/api/getAIResponse';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI Response:", data.content);
    return data.content;
  } catch (error) {
    console.error("Error in fetching AI response:", error);
    throw error;
  }
}

module.exports ={getAIResponse};
