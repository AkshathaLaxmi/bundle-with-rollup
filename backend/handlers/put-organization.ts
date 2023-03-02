import { randomUUID } from "crypto";
import { AnyObject } from "yup/lib/types";
import { putItem } from "../utils/db";

exports.handler = async (event: AnyObject) => {
    try {
        console.log(`EVENT: ${JSON.stringify(event)}`);
        const organization = event?.arguments?.input;
        organization.id = randomUUID();

        const tableName = process.env.ORGANIZATION_TABLE || ""
        const result = await putItem(tableName, organization);

        return {
            statusCode: 200,
            body: JSON.stringify(result)
        }
    } catch (err) {
        console.error(err);
        return {
            statusCode: 400,
            body: JSON.stringify(err)
        }
    }
}