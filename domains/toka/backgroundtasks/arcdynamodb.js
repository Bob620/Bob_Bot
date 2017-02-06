const BackgroundTask = require('./backgroundtask.js');
const FlakeId = require('flake-idgen');
const intformat = require('biguint-format');
const flake = new FlakeId();

const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',
  endpoint: 'dynamodb.us-east-1.amazonaws.com'
});

const dynamodb = new AWS.DynamoDB();

class ArcDynamoDB extends BackgroundTask {
  constructor(toka) {
    super(toka);

    this.chata.on("message", (message) => {
      const item = {
        "snowflake_id": {
          S: intformat(flake.next(), "dec")
        },
        "user": {
          S: message.username
        },
        "message": {
          S: message.text
        },
        "timestamp": {
          S: message.timestamp
        }
      }

      dynamodb.putItem({TableName: 'nlp-ds', Item: item}, (err, data) => {
        if (err) {
          log("ERROR", "DynamoDB Rejected Message");
          console.log(err, err.stack);
        }
      });
    });
  }

  start() {
    log("DynamoDB", "enabled", "disabled");
  }
}

function log(name, newInfo, oldInfo) {
    const dateObject = new Date().toISOString().split('T');
    const date = dateObject[0];
    const time = dateObject[1].slice(0, -5);

    if (oldInfo) {
        console.log(`${date}|${time}|TOKA|${name}| ${oldInfo} -> ${newInfo}`);
    } else {
        console.log(`${date}|${time}|TOKA|${name}| ${newInfo}`);
    }
}

module.exports = ArcDynamoDB
