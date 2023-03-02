import { AnyObject } from "yup/lib/types";
import { scanItems } from "../utils/db";

exports.handler = async (event: AnyObject) => {
    try {
        console.log(`EVENT: ${JSON.stringify(event)}`);
        const tableName = process.env.USER_TABLE || "";
        const users = await scanItems(tableName);
        return {
            statusCode: 200,
            body: JSON.stringify(users)
        }
    } catch (err) {
        console.error(err);
        return {
            statusCode: 400,
            body: JSON.stringify(err)
        }
    }
}