import Tesseract from "tesseract.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // temporary
});

export async function processImageAndChat(imageFile, maxRetries = 3) {
  try {
    // Step 1: Extract text from the image using Tesseract.js
    const ocrResult = await Tesseract.recognize(imageFile, "eng", {
      logger: (info) => console.log(info), // Log OCR progress
    });

    const extractedText = ocrResult.data.text.trim();
    console.log("Extracted Text:", extractedText);

    if (!extractedText) {
      throw new Error("No text was extracted from the image.");
    }

    // Step 2: Retry logic for ChatGPT
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are a precise and detail-oriented assistant. Your task is to analyze text and output valid, properly formatted JSON that matches the specified schema.`,
            },
            {
              role: "user",
              content: `The following text was extracted from an image. Analyze it and return a valid JSON object in the exact format described below.

              Schema:
              - calendars: An array of objects, where each object includes:
                - firstDay: A string in YYYY-MM-DD format representing the first day of the schedule.
                - lastDay: A string in YYYY-MM-DD format representing the last day of the schedule.
                - startTime: A string in HH:MM format representing the start time of the class.
                - endTime: A string in HH:MM format representing the end time of the class.
                - daysOfClass: An object with boolean values for days of the week (e.g., { "monday": true, "tuesday": false, ... }).
                - instructorName: A string representing the name of the instructor.
                - className: A string representing the class name.
                - location: A string representing the location of the class.
                - page: An integer representing the page number associated with this data.
                - academicTerm: A string representing the academic term (e.g., "Fall2024").

              Example Output:
              {
                "calendars": [
                  {
                    "firstDay": "2025-01-01",
                    "lastDay": "2025-05-30",
                    "startTime": "11:00",
                    "endTime": "12:00",
                    "daysOfClass": {
                      "monday": true,
                      "tuesday": false,
                      "wednesday": true,
                      "thursday": false,
                      "friday": true,
                      "saturday": false,
                      "sunday": false
                    },
                    "instructorName": "Pogue",
                    "className": "SWE",
                    "location": "AS104",
                    "page": 0,
                    "academicTerm": "Spring2025"
                  }
                ]
              }

              Important Notes:
              - Ensure all fields strictly adhere to the specified schema.
              - Output only the JSON object, with no additional commentary or text.
              - If the extracted text is incomplete or ambiguous, make reasonable assumptions but ensure the output is always valid JSON.

              Extracted Text:
              ${extractedText}`,
            },
          ],
        });

        const chatResponse = completion.choices[0].message.content.trim();
        console.log("ChatGPT Response:", chatResponse);

        // Parse the response as JSON
        const structuredData = JSON.parse(chatResponse);

        // Post-process `page` if necessary
        structuredData.calendars.forEach((calendar) => {
          if (typeof calendar.page === "string") {
            calendar.page = Number(calendar.page);
          }
        });

        console.log("Structured Data:", structuredData);
        return structuredData; // Return the parsed JSON if successful
      } catch (jsonError) {
        console.warn(`Attempt ${attempt} failed to parse JSON response.`);
        if (attempt === maxRetries) {
          throw new Error("ChatGPT response is not a valid JSON after multiple attempts.");
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  } catch (error) {
    console.error("Error processing image and ChatGPT:", error.message || error);
    throw error;
  }
}
