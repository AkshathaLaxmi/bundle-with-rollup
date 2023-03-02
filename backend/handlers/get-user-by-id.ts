import { AnyObject } from "yup/lib/types";
import { getItemById } from "../utils/db";

exports.handler = async (event: AnyObject) => {
    try {
        console.log(`EVENT: ${JSON.stringify(event)}`);
        const tableName = process.env.USER_TABLE || ""
        const user = await getItemById(tableName, event?.arguments?.id);

        return {
            statusCode: 200,
            body: JSON.stringify(user)
        }
    } catch (err) {
        console.error(err);
        return {
            statusCode: 400,
            body: JSON.stringify(err)
        }
    }
}