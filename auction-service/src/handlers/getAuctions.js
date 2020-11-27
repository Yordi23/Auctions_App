import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";
import validator from "@middy/validator";
import getAuctionsSchema from "../lib/schemas/getAuctionsSchema";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  let auctions;
  const { status } = event.queryStringParameters;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: "statusAndEndDate",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeValues: {
      ":status": status,
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  try {
    const result = await dynamoDB.query(params).promise(); // We need to convert this to a promise in order to be able to use "await"

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

export const handler = commonMiddleware(getAuctions).use(
  validator({ inputSchema: getAuctionsSchema, useDefaults: true })
);
