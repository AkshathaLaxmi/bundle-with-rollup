import { DynamoDB } from "aws-sdk";
import { ItemList, PutItemInput, ScanInput } from "aws-sdk/clients/dynamodb";
import { AnyObject } from "yup/lib/types";

export const dynamoDB = new DynamoDB.DocumentClient({
    region: process.env.REGION
});


export async function getItemById(tableName: string, id: string) {
    const params = {
        TableName: tableName,
        Key: {
            id: id
        }
    }
    const data = await dynamoDB.get(params).promise();
    return data?.Item;
}

export async function scanItems(tableName: string) {
    const params: ScanInput = {
        TableName: tableName
    }

    let result: ItemList = []

    do {
        const data = await dynamoDB.scan(params).promise();
        const items = data?.Items || [];
        result = [...result, ...items];
        params.ExclusiveStartKey = data?.LastEvaluatedKey;
    } while (params.ExclusiveStartKey);

    return result;
}

export async function putItem(tableName: string, item: AnyObject) {
    const params: PutItemInput = {
        TableName: tableName,
        Item: item
    }

    const result = await dynamoDB.put(params).promise();
    return result;
}