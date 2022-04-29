/* eslint-disable max-lines */
import { ApiGatewayContract } from '../apiGatewayContract';

describe('httpApiContract', () => {
  const pathParametersSchema = {
    type: 'object',
    properties: { userId: { type: 'string' }, pageNumber: { type: 'string' } },
    required: ['userId', 'pageNumber'],
    additionalProperties: false,
  } as const;

  const queryStringParametersSchema = {
    type: 'object',
    properties: { testId: { type: 'string' } },
    required: ['testId'],
    additionalProperties: false,
  } as const;

  const headersSchema = {
    type: 'object',
    properties: { myHeader: { type: 'string' } },
    required: ['myHeader'],
  } as const;

  const bodySchema = {
    type: 'object',
    properties: { foo: { type: 'string' } },
    required: ['foo'],
  } as const;

  const outputSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
    },
    required: ['id', 'name'],
  } as const;

  describe('when all parameters are set', () => {
    const httpApiContract = new ApiGatewayContract({
      id: 'testContract',
      path: '/users/{userId}',
      method: 'GET',
      integrationType: 'httpApi',
      pathParametersSchema,
      queryStringParametersSchema,
      headersSchema,
      bodySchema,
      outputSchema,
    });

    it('should have the correct trigger', () => {
      expect(httpApiContract.trigger).toEqual({
        httpApi: {
          path: '/users/{userId}',
          method: 'GET',
        },
      });
    });

    it('should have the correct complete trigger', () => {
      expect(httpApiContract.getCompleteTrigger({ authorizer: '123' })).toEqual(
        {
          httpApi: {
            path: '/users/{userId}',
            method: 'GET',
            authorizer: '123',
          },
        },
      );
    });

    it('should have the correct inputSchema', () => {
      const i = httpApiContract.inputSchema;
      expect(httpApiContract.inputSchema).toEqual({
        type: 'object',
        properties: {
          pathParameters: pathParametersSchema,
          queryStringParameters: queryStringParametersSchema,
          headers: headersSchema,
          body: bodySchema,
        },
        required: [
          'pathParameters',
          'queryStringParameters',
          'headers',
          'body',
        ],
        additionalProperties: true,
      });
    });

    it('should have the correct outputSchema', () => {
      expect(httpApiContract.outputSchema).toEqual(outputSchema);
    });

    it('should have the correct fullContractSchema', () => {
      expect(httpApiContract.fullContractSchema).toEqual({
        type: 'object',
        properties: {
          contractId: { const: 'testContract' },
          contractType: { const: 'httpApi' },
          path: { const: '/users/{userId}' },
          method: { const: 'GET' },
          pathParameters: pathParametersSchema,
          queryStringParameters: queryStringParametersSchema,
          headers: headersSchema,
          body: bodySchema,
          output: outputSchema,
        },
        required: [
          'contractId',
          'contractType',
          'path',
          'method',
          'pathParameters',
          'queryStringParameters',
          'headers',
          'body',
          'output',
        ],
        additionalProperties: false,
      });
    });

    it('should be requestable with the correct parameters', () => {
      expect(
        httpApiContract.getRequestParameters({
          pathParameters: { userId: '123', pageNumber: '12' },
          headers: { myHeader: '12' },
          queryStringParameters: { testId: '155' },
          body: { foo: 'bar' },
        }),
      ).toEqual({
        method: 'GET',
        path: '/users/123',
        headers: { myHeader: '12' },
        queryStringParameters: { testId: '155' },
        body: { foo: 'bar' },
      });
    });

    it('should generate open api documentation', () => {
      expect(httpApiContract.openApiDocumentation).toEqual({
        path: '/users/{userId}',
        method: 'get',
        documentation: {
          parameters: [
            {
              in: 'query',
              name: 'testId',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              in: 'path',
              name: 'userId',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              in: 'path',
              name: 'pageNumber',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    foo: {
                      type: 'string',
                    },
                  },
                  required: ['foo'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                      },
                      name: {
                        type: 'string',
                      },
                    },
                    required: ['id', 'name'],
                  },
                },
              },
            },
          },
        },
      });
    });
  });
});
