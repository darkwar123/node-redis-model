# Redis schema-based orm for node.js
Provides a straight-forward, schema-based solution to model your application data.
# Example
```javascript
const Redis = require('ioredis');
const redis = new Redis();

const ModelPlugin = require('node-redis-model');
ModelPlugin(redis);

redis.model('Message', {
	schema: {
		name: {
			type: "string",
			default: "user"
		},
		text: {
			type: "string"
		},
		createdAt: {
			type: "number",
			default: 0
		},
		required: ["text"]
	}
});

const Message = redis.model('Message');

const message = new Message({
	text: "Hello, World!"
});

message.save()
.then(() => Message.find())
.then(messages => {
	console.log(messages); // [{name: "user", text: "Hello, World!", createdAt: 0}]
});

```
