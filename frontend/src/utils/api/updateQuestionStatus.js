import axios from "axios";

const updateQuestionStatus = async ({ questionId, action }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const email = user?.email;
  
      if (!email) {
        console.error("User email not found in localStorage.");
        return;
      }
  
      console.log("Sending request with data:", { questionId, action, email });
  
      const response = await axios.post(
        "http://127.0.0.1:8000/questions/update-status/",
        {
          question_id: questionId,
          action: action,
        },
        {
          headers: {
            "X-User-Email": email,
            "Content-Type": "application/json", // add this explicitly
          },
        }
      );
  
      console.log("Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating question status:", error);
    }
  };
  


export default updateQuestionStatus;