import { JSONSchema } from 'json-schema-to-ts';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';

import { ConstrainedJSONSchema } from 'types/constrainedJSONSchema';
import { HttpMethod } from 'types/http';

import { ApiGatewayIntegrationType, InputSchemaType } from './types';

/**
 * ApiGatewayContract:
 *
 * A contract used to define a type-safe interaction between AWS Services through Api Gateway.
 *
 * Main features:
 * - input and output dynamic validation with JSONSchemas on both end of the contract;
 * - type inference for both input and output;
 * - generation of a contract document that can be checked for breaking changes;
 * - generation of open api documentation
 */
export class ApiGatewayContract<
  Path extends string = string,
  Method extends HttpMethod = HttpMethod,
  IntegrationType extends ApiGatewayIntegrationType = ApiGatewayIntegrationType,
  PathParametersSchema extends ConstrainedJSONSchema | undefined =
    | ConstrainedJSONSchema
    | undefined,
  QueryStringParametersSchema extends ConstrainedJSONSchema | undefined =
    | ConstrainedJSONSchema
    | undefined,
  HeadersSchema extends ConstrainedJSONSchema | undefined =
    | ConstrainedJSONSchema
    | undefined,
  BodySchema extends JSONSchema | undefined = JSONSchema | undefined,
  OutputSchema extends JSONSchema | undefined = JSONSchema | undefined,
> {
  /**
   * The discriminating type of this contract
   */
  public contractType = 'apiGateway' as const;

  /**
   *  An id to uniquely identify the contract among services.
   */
  public id: string;

  /**
   * The path on which the lambda will be triggered
   */
  public path: Path;

  /**
   * The http method
   */
  public method: Method;

  /**
   * Api gateway version, @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html
   */
  public integrationType: IntegrationType;

  /**
   * A JSONSchema used to validate the path parameters and infer their types.
   * @see https://github.com/ThomasAribart/json-schema-to-ts#fromschema.
   */
  public pathParametersSchema: PathParametersSchema;

  /**
   * A JSONSchema used to validate the query parameters and infer their types
   */
  public queryStringParametersSchema: QueryStringParametersSchema;

  /**
   * A JSONSchema used to validate the headers and infer their types
   */
  public headersSchema: HeadersSchema;

  /**
   * A JSONSchema used to validate the body and infer its type
   */
  public bodySchema: BodySchema;

  /**
   * A JSONSchema used to validate the output and infer its type
   */
  public outputSchema: OutputSchema;

  /**
   * A JSONSchema used to validate the input and infer its type
   */
  public inputSchema: InputSchemaType<
    PathParametersSchema,
    QueryStringParametersSchema,
    HeadersSchema,
    BodySchema,
    true
  >;

  /**
   * Builds a new ApiGateway contract
   *
   * @param id an id to uniquely identify the contract among services. Beware of uniqueness!
   * @param path the path on which the lambda will be triggered
   * @param method the http method
   * @param integrationType httpApi or restApi, @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html
   * @param pathParametersSchema a JSONSchema used to validate the path parameters and infer their types.
   * Please note that the `as const` directive is necessary to properly infer the type from the schema.
   * See https://github.com/ThomasAribart/json-schema-to-ts#fromschema.
   * Also please note that for Typescript reasons, you need to explicitly pass `undefined` if you don't want to use the schema.
   * @param queryStringParametersSchema a JSONSchema used to validate the query parameters and infer their types (Same constraints).
   * @param headersSchema a JSONSchema used to validate the headers and infer their types (Same constraints).
   * @param bodySchema a JSONSchema used to validate the body and infer its type (Same constraints).
   * @param outputSchema a JSONSchema used to validate the output and infer its type (Same constraints).
   */
  constructor(props: {
    id: string;
    path: Path;
    method: Method;
    integrationType: IntegrationType;
    pathParametersSchema: PathParametersSchema;
    queryStringParametersSchema: QueryStringParametersSchema;
    headersSchema: HeadersSchema;
    bodySchema: BodySchema;
    outputSchema: OutputSchema;
  }) {
    this.id = props.id;
    this.path = props.path;
    this.method = props.method;
    this.integrationType = props.integrationType;
    this.pathParametersSchema = props.pathParametersSchema;
    this.queryStringParametersSchema = props.queryStringParametersSchema;
    this.headersSchema = props.headersSchema;
    this.bodySchema = props.bodySchema;
    this.outputSchema = props.outputSchema;
    this.inputSchema = this.getInputSchema();
  }

  private getInputSchema(): InputSchemaType<
    PathParametersSchema,
    QueryStringParametersSchema,
    HeadersSchema,
    BodySchema,
    true
  > {
    const properties = omitBy(
      {
        pathParameters: this.pathParametersSchema,
        queryStringParameters: this.queryStringParametersSchema,
        headers: this.headersSchema,
        body: this.bodySchema,
      } as const,
      isUndefined,
    );

    return {
      type: 'object',
      properties,
      // @ts-ignore here object.keys is not precise enough
      required: Object.keys(properties),
      additionalProperties: true,
    };
  }
}
