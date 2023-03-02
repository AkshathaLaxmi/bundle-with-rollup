import { AnyObject } from "yup/lib/types";
import { scanItems } from "../utils/db";

exports.handler = async (event: AnyObject) => {
    try {
        console.log(`EVENT: ${JSON.stringify(event)}`);
        const tableName = process.env.ORGANIZATION_TABLE || "";
        const organizations = await scanItems(tableName);
        return {
            statusCode: 200,
            body: JSON.stringify(organizations)
        }
    } catch (err) {
        console.error(err);
        return {
            statusCode: 400,
            body: JSON.stringify(err)
        }
    }
}