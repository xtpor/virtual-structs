
### Installation

`npm install virtual-structs`

### Examples

```javascript
var vstructs = require('virtual-structs');


var Temperature = vstructs('Celsius', 'Fahrenheit');
// or: var Temperature = vstructs(['Celsius', 'Fahrenheit']);

Temperature.impl({
    convert: function () {
        return this.match({
            Celsius: function (c) {
                return Temperature.Fahrenheit(c * 9/5 + 32);
            },
            Fahrenheit: function (f) {
                return Temperature.Celsius((f - 32) * 5/9);
            },
        });
    }
});

var c = Temperature.Celsius(30);
var f = c.convert();

console.log(f[0]); // 86
```

### Documentations

#### `vstructs([...variants | variantsArray]) -> Enum`

Create a new enumeration, variant name must be a valid javascript identifier
with camel case. (i.e. FooBar)

```javascript
var vstructs = require('virtual-structs');

var Color = vstruct(['RGB', 'HEX', 'HSL', 'HSV', 'RGBA']);
// or
var Color = vstruct('RGB', 'HSV', 'HSL', 'HSV', 'RGBA');
```

#### `Enum[variantName](...args) -> Variant`

Instantiate this enum with some arguments

```javascript
var myRGB = Color.RGB(255, 100, 0);

console.log(myRGB[0]); // 255
console.log(myRGB[1]); // 100
console.log(myRGB[2]); // 0
console.log(myRGB.length); // 3

var myHEX = Color.HEX('#ff6400');

console.log(myHEX[0]); // '#ff6400'
console.log(myHEX.length); // 1
```

#### `Enum#impl(methods) -> this`

Implements some methods on this enum

```javascript
Color.impl({
    greet: function () {
        console.log('hello, ' + this[0]);
    },
    greet2: function () {
        console.log('hello2, ' + this[0]);
    }
});

myRGB.greet(); // log 'hello, 255'
myHEX.greet2(); // log 'hello2, #ff6400'
```

#### `Enum#extend(variant) -> this`

Extend this enum with a new variant

```javascript
Color.extend('VEC');

var myVEC = Color.VEC(1.0, 0.39, 0.0);
```

#### `Variant#match(dispatcher) -> Object`

Call the appropriate function / return a value base on the variant  
`_` represent other cases

```javascript
function showInfo (color) {
    return color.match({
        RGB: function (r, g, b) {
            return 'rgb r=' + r;
        },
        RGBA: function (r, g, b, a) {
            return 'rgba r=' + r;
        },
        _: function () {
            return 'other type of color';
        }
    });
}

showInfo(Color.RGB(255, 100, 0)); // -> 'rgb r=255'
showInfo(Color.RGBA(255, 100, 0, 0)); // -> 'rgba r=255'
showInfo(Color.HEX("#FF1234")); // -> 'other type of color'
```

#### `Variant#caseOf(variant, handler) -> Object`

Equivalent the a single variant match

```javascript
someColor.caseOf('RGB', function () {
    console.log("I'm a RGB");
});
```

#### `Variant#typeOf(variant) -> boolean`

Test the type of the variant

```javascript
Color.RGB(255, 0, 0).typeOf('RGB'); // -> true
Color.HEX('#ff0000').typeOf('RGB'); // -> false
```

#### `Variant#oneOf([...variants | variantsArray]) -> boolean`

```javascript
Color.RGB(255, 0, 0).typeOf('RGB', 'HEX'); // -> true
Color.HEX('#ff0000').typeOf(['RGB', 'HEX']); // -> true
Color.RGBA(255, 0, 0, 0).typeOf('RGB', 'HEX'); // -> false
```

#### `Variant#equals(otherVariant) -> boolean`

Perform a value-based equality test

```javascript
var a = Color.RGB(255, 0, 0);
var b = Color.RGB(255, 0, 0);
var c = Color.RGB(255, 100, 0);

a === b; // -> false
a.equals(b); // -> true
a.equals(c); // -> false
```

#### `Variant#notEquals(otherVariant) -> boolean`

```javascript
var a = Color.RGB(255, 0, 0);
var b = Color.RGB(255, 100, 0);

a.notEquals(b); // -> true
```

### Notes

1. You can call any method of array on the variant object

```javascript
var myRGB = Color.RGB();
console.log(myRGB.length); // -> 0
myRGB.push(255);

console.log(myRGB[0]); // -> 255
console.log(myRGB.length); // -> 1
```

2. You can extend the prototype of each variant

```javascript
Color.RGB.prototype.formatRGB = function () {
    this.caseOf('RGB', function (r, g, b) {
        console.log(r, ':', g, ':', b);
    });
};

Color.RGB(1, 2, 3).formatRGB(); // '1 : 2 : 3'
```
