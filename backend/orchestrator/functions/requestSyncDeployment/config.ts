import { requestSyncDeployment } from '@swarmion/orchestrator-contracts';
import { getTrigger } from '@swarmion/serverless-contracts';
import { getHandlerPath, LambdaFunction } from '@swarmion/serverless-helpers';

import { cdkStack } from '@/resources';

const config: LambdaFunction = {
  environment: {
    ORCHESTRATOR_TABLE_NAME: cdkStack.resolve(cdkStack.dynamodbName) as string,
  },
  handler: getHandlerPath(__dirname),
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Resource: [cdkStack.resolve(cdkStack.dynamodbArn)],
      Action: ['dynamodb:PutItem'],
    },
  ],
  iamRoleStatementsInherit: true,
  events: [getTrigger(requestSyncDeployment)],
};

export default config;
