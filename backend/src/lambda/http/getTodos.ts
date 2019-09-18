import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import * as AWS  from 'aws-sdk'
import * as AWSXRay  from 'aws-xray-sdk'
import { getAllTodos } from '../../business/todo'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('getTodos')
const docClient = new XAWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const imagesTable = process.env.IMAGES_TABLE


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // DONE: Get all TODO items for a current user
  logger.info('Processing event: ', event)
  const subject = event.requestContext.authorizer.principalId
  const items = await getAllTodos(subject)

  await Promise.all(items.map(async (item) => {
    logger.info('Processing item: ', {item: item})
    const result = await docClient.query({
        TableName: imagesTable,
        KeyConditionExpression: "todoId = :id",
        Limit: 1,
        ScanIndexForward: false,
        ExpressionAttributeValues: {
            ":id": item.todoId
        }
    }).promise()

    logger.info('Processing result image: ', {result: result})
    if(result.Count > 0){
      item.attachmentUrl = result.Items[0].imageUrl
    }
  }));
  
  logger.info('Processing result: ', {result: items})

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items
    })
  }
}
