
### Installation

`npm install virtual-structs`

### Examples

```javascript
var vstructs = require('.');


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
