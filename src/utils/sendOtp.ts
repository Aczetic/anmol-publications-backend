import axios from "axios";


const sendOtp = async (
  templateId: number = 1,
  params: { name: string; otp: string },
  sender: { name: string , email: string},
  to: {name:string , email:string}
) => {
  const timeout = 10000; // timout after 10s
  let result = false;

  try {
    const response = await axios
      .post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender,
          templateId,
          params,
          to: [
            {
              ...to,
            },
          ],
        },
        {
          headers: {
            accept: "application/json",
            "api-key": process.env.BREVO_API_KEY,
            "content-type": "application/json",
          },
          timeout
        },
      )
      .then((res) => {
        // what to do after the mail is sent successfully
        if (res.status === 201) {
          result = true;
        }
      });
  } catch (error) {
    console.log(error)
    result  = false;
  }

  return result;
};

export default sendOtp;
