module.exports = function Numeric (schema, model) {
    /**
     * Increment number by value
     * @param {Number} value - increment number
     * @return {Promise}
     * @static
     * */
    model.increment = function increment (value = 1) {
        return new Promise((resolve, reject) => {
            schema.connection.incrby(schema.collection, value)
                .then(data => {
                    resolve(Number(data));
                })
                .catch(reject)
        });
    };

    /**
     * Get the value of this number
     * @return {Promise}
     * */
    model.get = function () {
        return new Promise((resolve, reject) => {
            schema.connection.get(schema.collection)
                .then(data => {
                    resolve(Number(data));
                })
                .catch(reject)
        });
    };

	/**
     * Set the value of this number
     * @param {Number} value - number to set
     * @return {Promise}
     * */
    model.set = function (value = 0) {
		return new Promise((resolve, reject) => {
			if(typeof value !== 'number'){
				return reject(new TypeError('Value must be a number!'))
			}
			
            this.schema.connection.set(schema.collection, value)
                .then(resolve)
                .catch(reject);
        });
    };
	
	/**
     * Save number
     * @return {Promise}
     * */
    model.prototype.save = function (){
		return new Promise((resolve, reject) => {
            this.validate()
                .then(() => {
                    return schema.connection.set(schema.collection, this.value)
                })
                .then(resolve)
                .catch(reject);
        });
    };
	
    return model;
};