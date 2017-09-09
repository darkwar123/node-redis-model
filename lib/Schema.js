const Model = class Model {
    constructor(schema, opts){
        Object.defineProperty(this, 'schema', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: schema
        });

        Object.assign(this, opts);
    }
    /**
     * Validate schema for errors
     * @return {Promise}
	 */
    validate(){
        return this.schema.asyncValidate(this.toObject());
    }
    /**
     * Convert this instance to object and validate it
     * @return {Object}
     * */
    toJSON(){
        let data = this.toObject();
        this.schema.validate(data);

        return data;
    }
    /**
     * Convert this instance to object
     * @return {Object}
     * */
    toObject(){
        let result = {};

        for(let i in this){
            if(
                typeof this[i] !== 'function'
                && this.hasOwnProperty(i)
            ){
                result[i] = this[i];
            }
        }

        return result;
    }
};

const pluralize = require('pluralize');

const Ajv = new (require('ajv'))({
    removeAdditional: "all",
    useDefaults: true,
    coerceTypes: true
});

const SchemaTypes = {
    'list': require('./types/List'),
    'default': require('./types/List')
};

class Schema{
    /**
     * Create new Schema
     * @param {String} name - name of the schema for collection name
     * @param {Object} schema - schema rules for validation
     * @param {String} type - redis type for saving
     * @param {Redis} connection - redis connection
     * @constructor
     * */
    constructor(name, { schema, type, connection }){
        if(!schema){
            throw new Error('Schema is required!');
        }

        this.name = String(name);
        this.connection = connection;

        this.validate = Ajv.compile(schema);
        this.asyncValidate = Ajv.compile(Object.assign(schema, {
            $async: true
        }));

        this.collection = 'collections:' + pluralize(this.name.toLowerCase());
        this.SchemaType = SchemaTypes[type] || SchemaTypes.default;

        return this.SchemaType(this, this.model);
    }
    get model(){
        const schema = this;

        const classes = {
            [this.name]: class extends Model{
                constructor(opts){
                    super(schema, opts);
                }
            }
        };

        return classes[this.name];
    }
}

module.exports = Schema;