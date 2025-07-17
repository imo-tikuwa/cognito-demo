import type { PostAuthenticationTriggerEvent } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const lambdaHandler = async (event: PostAuthenticationTriggerEvent): Promise<PostAuthenticationTriggerEvent> => {
    // console.log('Authenticated event:', JSON.stringify(event, null, 2));

    try {
        const tableName = process.env.LOGIN_LOGS_TABLE!;
        const item = {
            UserId: event.userName,
            Email: event.request.userAttributes.email,
            Timestamp: Math.floor(Date.now() / 1000),
            NewDeviceUsed: event.request.newDeviceUsed,
            TriggerSource: event.triggerSource,
        };

        await client.send(
            new PutCommand({
                TableName: tableName,
                Item: item,
            }),
        );
        console.log('Login record saved to DynamoDB');
    } catch (error) {
        console.error('Failed to save login record:', error);
    }

    // 後続の処理を継続させるには event を返す必要がある
    // 認証後処理だからと適当に void とか返すと「Invalid lambda function output : Invalid JSON」というエラーが出てしまうので注意
    return event;
};
