
var verifyName = function (variant) {
    if (!(typeof variant === 'string' && /[A-Z][a-zA-Z0-9]*/.test(variant))) {
        throw new Error('invalid variant name ' + variant);
    }
};

var collectArgs = function (args) {
    if (Array.isArray(args[0])) {
        return args[0];
    } else {
        return [].slice.call(args);
    }
};

var VirtualStructs = module.exports = function (variants) {
    var variantNames = collectArgs(arguments);
    var that = Object.create(VirtualStructs.prototype);
    that.variants = {};
    that.variants.prototype = Object.create(variantPrototype);

    variantNames.forEach(verifyName);
    variantNames.forEach(function (name) {
        that.extend(name);
    });

    return that;
};

VirtualStructs.prototype.extend = function (variant) {
    verifyName(variant);
    this.variants[variant] = newVariant(variant, this.variants.prototype);
    if (!this[variant]) {
        this[variant] = this.variants[variant];
    }
    return this;
};

VirtualStructs.prototype.impl = function (methods) {
    Object.keys(methods).forEach(function (methodName) {
        var method = methods[methodName];
        this.variants.prototype[methodName] = method;
    }, this);
    return this;
};

var variantPrototype = Object.create(Array.prototype);

variantPrototype.typeOf = function (v) {
    return v === this.variant;
};

variantPrototype.match = function (dispatcher) {
    var handler = dispatcher[this.variant] || dispatcher._;
    if (typeof handler === 'function') {
        return handler.apply(handler, this);
    } else {
        return handler;
    }
};

variantPrototype.caseOf = function (variant, handler) {
    var dispatcher = {};
    dispatcher[variant] = handler;
    return this.match(dispatcher);
};

variantPrototype.equals = function (other) {
    return this.variant === other.variant && this.every(function (v, i) {
        return v === other[i];
    });
};

variantPrototype.notEquals = function (val) {
    return !this.equals(val);
};

variantPrototype.clone = function () {
    return this.constructor.apply(this.slice());
};

variantPrototype.oneOf = function () {
    var variantNames = collectArgs(arguments);
    return variantNames.some(function (name) {
        return this.typeOf(name);
    }, this);
};

variantPrototype.toString = function () {
    return this.variant + '(' + this.join(', ') + ')';
};

variantPrototype.valueOf = function () {
    return this.variant;
};

var newVariant = function (variant, variantPrototype) {
    var ConcreteVariant = function () {
        var that = Object.create(ConcreteVariant.prototype);
        that.variant = variant;
        [].push.apply(that, [].slice.call(arguments));

        return that;
    };

    ConcreteVariant.prototype = Object.create(variantPrototype);
    ConcreteVariant.prototype.constructor = ConcreteVariant;

    return ConcreteVariant;
};
