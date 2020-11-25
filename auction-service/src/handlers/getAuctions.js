import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  let auctions;

  try {
    const result = await dynamoDB
      .scan({
        TableName: process.env.AUCTIONS_TABLE_NAME,
      })
      .promise(); // We need to convert this to a promise in order to be able to use "await"

    auctions = result.Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error); //In real world, its a bad practice to expose raw errors to clients
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = commonMiddleware(getAuctions);
