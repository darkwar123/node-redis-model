'use strict';

const Schema = require('./lib/Schema');

module.exports = function (redis) {
    redis._models = {};

    redis.model = function (name, schema) {
        if(schema){
            schema.connection = this;
			
            this._models[name] = new Schema(name, schema);
        }

        return this._models[name];
    }
};