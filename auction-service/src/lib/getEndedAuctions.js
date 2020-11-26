import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export async function getEndedAuctions() {
  const now = new Date();

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: "statusAndEndDate",
    // We use "#status" instead of just "status", because "status" is a reserved word
    KeyConditionExpression: "#status = :status AND endingAt <= :now",
    ExpressionAttributeValues: {
      ":status": "OPEN",
      ":now": now.toISOString(),
    },
    // This is for changing "#status" to "status" in the output
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  const result = await dynamoDB.query(params).promise();

  return result.Items;
}
