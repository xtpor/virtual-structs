
var vstructs = require('.');

var expect = require('chai').expect;
var assert = require('assert');

describe('vstructs', function () {

    var Temperature = vstructs('Celsius', 'Fahrenheit');
    var Foo = vstructs(['A', 'B', 'C', 'D']);

    it('example #1', function () {

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

        expect(c.variant).to.be.equal('Celsius');
        expect(f.variant).to.be.equal('Fahrenheit');

        expect(c[0]).to.be.equal(30);
        expect(f[0]).to.be.equal(86);

        assert(Temperature.Celsius(10).equals(Temperature.Celsius(10)));
        assert(Temperature.Celsius(10).notEquals(Temperature.Celsius(15)));
        assert(Temperature.Celsius(10).notEquals(Temperature.Fahrenheit(15)));

        var temp = Temperature.Celsius(123);
        assert(temp.clone().equals(temp));
    });

    it('example #2', function () {
        var Numbers = vstructs(['N1', 'N3', 'N5', 'N6']);

        // find the reminder of 3
        var reminder3 = function (e) {
            return e.match({
                N1: 1,
                N5: 2,
                _: 0, // _ indicates default case
            });
        };

        expect(reminder3(Numbers.N1())).to.be.equal(1);
        expect(reminder3(Numbers.N3())).to.be.equal(0);
        expect(reminder3(Numbers.N5())).to.be.equal(2);
        expect(reminder3(Numbers.N6())).to.be.equal(0);

        assert(Numbers.N1().typeOf('N1'));
        assert(Numbers.N3().oneOf('N3', 'N5'));
        assert(Numbers.N5().oneOf(['N5', 'N6']));
    });

    it('caseOf #1', function () {
        var result = Foo.A(10).caseOf('A', function (i) {
            return i + 1;
        });

        expect(result).to.be.equal(11);
    });


    it('caseOf #2', function () {
        var result = Foo.B(10).caseOf('A', function (i) {
            return i + 1;
        });

        /*jshint expr: true*/
        expect(result).to.be.undefined;
    });

    it('extended variants should have access to previous defined methods', function () {
        var Foo = vstructs('A', 'B');

        Foo.impl({
            hello: function () {
                return 'helloworld';
            }
        });

        expect(Foo.A().hello()).to.be.equal('helloworld');

        Foo.extend('C');

        expect(Foo.C().hello()).to.be.equal('helloworld');
    });

    it('equality test', function () {
        var Foo = vstructs('A', 'B');

        assert(Foo.A().equals(Foo.A()));
        assert(Foo.A().notEquals(Foo.B()));
    });

});
