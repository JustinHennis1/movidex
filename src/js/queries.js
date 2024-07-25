const dotenv = require("dotenv");
dotenv.config();


async function getAIResponse(userInput) {
  const endpoint = '/api/getAIResponse';
  console.log("Sending user input:", userInput);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error details:", errorData);
      throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    console.log("Received AI response:", data);
    return data.content;
  } catch (error) {
    console.error('Detailed error in fetching AI response:', error);
    throw error;
  }
}

module.exports ={getAIResponse};