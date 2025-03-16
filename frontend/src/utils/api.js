import axios from "axios";

export const updateQuestionStatus = async (questionId, action, token) => {
  try {
    const response = await axios.post(
      "/api/questions/update-status/",
      { question_id: questionId, action },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating question status:", error);
    throw error;
  }
};
