const AWS = require('aws-sdk');
const unmarshalItem = require('dynamodb-marshaler').unmarshalItem;

AWS.config.update({
  region: 'us-west-2',
  endpoint: 'dynamodb.us-west-2.amazonaws.com'
});

class DynamoDB {
  constructor(tableName = "") {
    /**
     * The DynamoDB connection
     * @type {AWS.DynamoDB}
     * @readonly
     */
    Object.defineProperty(this, "dynamodb", {
      value: new AWS.DynamoDB()
    });

    /**
     * The name of the table to connect to
     * @type {string}
     */
    this.tableName = tableName;
  }

  /**
   * Puts an item into dynamodb
   * @param {map<map>} item
   * @returns {Promise}
   */
  putItem(item) {
    return Promise((resolve, reject) => {
      this.dynamodb.putItem({
        Item: item,
        TableName: this.tableName,
        ReturnValues: "NONE"
      }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    });
  }

  /**
   * Deletes an item from dynamodb
   * @param {map<map>} key Map of partitionKey [and if needed the sortKey]
   * @returns {Promise<map>}
   * @example
   * dynamodb.getItem({
   *   {
   *     "id": { S: "guildId" },
   *     "type": { S: "guild" }
   *   }
   * })
   * .then(() => {
   *   console.log("Item Deleted")
   * })
   * .catch((err) => {
   *   console.trace(err)
   * });
   */
  deleteItem(key) {
    return Promise((resolve, reject) => {
      this.dynamodb.deleteItem({
        Key: key,
        TableName: this.tableName
      }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    });
  }

  /**
   * Queries for an item in dynamodb
   * @param {map<map>} expressionAttributeValues A map of the expression values to compare in dynamodb
   * @param {string} keyConditionExpression A string of expressions to compare expressionAttributeValues against dynamodb
   * @param {boolean} [cache=true] Whether to cache the return data for 10 seconds
   * @param {array<string>} [attributesToGet=array] Denote what attributes are wanted from dynamodb
   * @returns {Promise<map>}
   * @example
   * dynamodb.query({
   *   {
   *     ":id": { S: "guildId" },
   *     ":type": { S: "guild" }
   *   },
   *   "id = :id AND type = :type",
   *   true,
   *   ["id", "giveme"]
   * })
   * .then((data) => {
   *   console.log(data);
   * })
   * .catch((err) => {
   *   console.trace(err);
   * });
   */
  query(expressionAttributeValues, keyConditionExpression, cache = true, attributesToGet = []) {
    let params = {
      ExpressionAttributeValues: expressionAttributeValues,
      KeyConditionExpression: keyConditionExpression,
      TableName: this.tableName,
      Select: "ALL_ATTRIBUTES",
      ComparisonOperator: "EQ"
    }

    if (attributeToGet !== []) {
      params.Select = "SPECIFIC_ATTRIBUTES"
      params.AttributesToGet = attributesToGet;
    }

    return Promise((resolve, reject) => {
      this.dynamodb.query(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Items.map(unmarshalItem));
        }
      })
    });
  }

  /**
   * Retrieves an item from dynamodb
   * @param {map<map>} key Map of partitionKey [and if needed the sortKey]
   * @param {boolean} [cache=true] Whether to cache the return data for 10 seconds
   * @returns {Promise<map>}
   * @example
   * dynamodb.getItem({
   *   {
   *     "id": { S: "guildId" },
   *     "type": { S: "guild" }
   *   },
   *   true
   * })
   * .then((item) => {
   *   console.log(item)
   * })
   * .catch((err) => {
   *   console.trace(err)
   * });
   */
  getItem(key, cache) {
    return Promise((resolve, reject) => {
      this.dynamodb.getItem({
        Key: key,
        TableName: this.tableName
      }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Item.map(unmarshalItem));
        }
      })
    });
  }

  /**
   * Updates an item in dynamodb
   * @param {object<string>} expressionAttributeNames A map of the expression names to replace or create in dynamodb
   * @param {map<map>} expressionAttributeValues A map of the expression values to use
   * @param {string} updateExpression A string of expressions to update expressionAttributeNames for expressionAttributeValues
   * @returns {Promise<map>}
   * @example
   * dynamodb.query({
   *   {
   *     "#ID": "id",
   *     "#TYPE": "type"
   *   },
   *   {
   *     ":id": { S: "newGuildId" },
   *     ":type": { S: "newType" }
   *   },
   *   "SET #ID = :id, #TYPE = :type"
   * })
   * .then((data) => {
   *   console.log(data);
   * })
   * .catch((err) => {
   *   console.trace(err);
   * });
   */
  updateItem(expressionAttributeNames, expressionAttributeValues, updateExpression) {
    return Promise((resolve, reject) => {
      this.dynamodb.updateItem({
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        UpdateExpression: updateExpression,
        TableName: this.tableName
      }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    });
  }
}
module.exports = DynamoDB;
