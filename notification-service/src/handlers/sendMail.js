import AWS from "aws-sdk";

const ses = new AWS.SES({ region: "eu-west-1" });

async function sendMail(event, context) {
  const params = {
    Source: "yordiogando@gmail.com",
    Destination: {
      ToAddresses: ["yordiogando@gmail.com"],
    },
    Message: {
      Body: {
        Text: {
          Data: "Hello from Serveless Course",
        },
      },
      Subject: {
        Data: "Test mail",
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
}

export const handler = sendMail;
