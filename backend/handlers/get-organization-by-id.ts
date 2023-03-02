import { AnyObject } from "yup/lib/types";
import { getItemById } from "../utils/db";

exports.handler = async (event: AnyObject) => {
    try {
        console.log(`EVENT: ${JSON.stringify(event)}`);
        const tableName = process.env.ORGANIZATION_TABLE || ""
        const organization = await getItemById(tableName, event?.arguments?.id);

        return {
            statusCode: 200,
            body: JSON.stringify(organization)
        }
    } catch (err) {
        console.error(err);
        return {
            statusCode: 400,
            body: JSON.stringify(err)
        }
    }
}