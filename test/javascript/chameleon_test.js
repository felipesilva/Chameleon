/**
Copyright (c) 2010 Felipe Silva felipef.silva@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

module('Chameleon Tests', {
    setup: function(){
        school = {
            enrolment: function() {
                return 123;
            },
            student: function() {
                this.enrolment();
            }
        };
    }
});

test('Test method mocked defaults', function() {
    school = {
        enrolment: function() {
            return 123;
        },
        student: function() {
            this.enrolment();
        }
    };
    
    var SchoolMock = new Chameleon();
    
    SchoolMock.expects('school.enrolment');
      
    ok(!SchoolMock.mockedMethod['enrolment'].called, 'Method key "called" default value False');
});

test('Test method part of the window object', function() {

    function enrolment() {
        return 123;
    }

    school = {
        student: function() {
            enrolment();
        }
    };
    
    var SchoolMock = new Chameleon();
    
    SchoolMock.expects('school.enrolment');
      
    ok(SchoolMock.mockedMethod['enrolment'], 'Method cloned');
});

test('Test method inside a object, one level', function() {
    school = {
        enrolment: function() {
            return 123;
        },
        student: function() {
            this.enrolment();
        }
    };
    
    var SchoolMock = new Chameleon();
    
    SchoolMock.expects('school.enrolment');
      
    ok(SchoolMock.mockedMethod['enrolment'], 'Method cloned');
});

test('Test if the mocked method was called', function() {
    school = {
        enrolment: function() {
            return 123;
        },
        student: function() {
            this.enrolment();
        }
    };
    
    var SchoolMock = new Chameleon();
    
    SchoolMock.expects('school.enrolment');
    
    school.student();
    
    ok(SchoolMock.mockedMethod['enrolment'].called, 'Method was called.');
});

test('Verify methods that was not called', function() {
    school = {
        enrolment: function() {
            return 123;
        },
        student: function() {
            this.enrolment();
        }
    };
    
    var SchoolMock = new Chameleon();
    
    SchoolMock.expects('school.enrolment');
    SchoolMock.expects('school.room');
    
    school.student();
    
    SchoolMock.verify();
    
    ok(SchoolMock.verify().result === false, SchoolMock.verify().message);
});

test('Verify if all mocked methods was called', function() {
    school = {
        enrolment: function() {
            return 123;
        },
        room: function() {
            return 456;
        },
        student: function() {
            this.identity = this.enrolment() + this.room();
        }
    };
    
    var SchoolMock = new Chameleon();
    
    SchoolMock.expects('school.enrolment');
    SchoolMock.expects('school.room');
    
    school.student();
    
    var _verify = SchoolMock.verify();

    ok(_verify.result, _verify.message);
});

test('Test message if all mocked methods was called', function() {
    school = {
        enrolment: function() {
            return 123;
        },
        room: function() {
            return 456;
        },
        student: function() {
            this.identity = this.enrolment() + this.room();
        }
    };
    
    var SchoolMock = new Chameleon();
    
    SchoolMock.expects('school.enrolment');
    SchoolMock.expects('school.room');
    
    school.student();
    
    var _verify = SchoolMock.verify();
    
    equals(_verify.message, 'All methods was called');
});

test('Test message when a mocked methods was not called', function() {
    school = {
        enrolment: function() {
            return 123;
        },
        student: function() {
            this.enrolment();
        }
    };
    
    var SchoolMock = new Chameleon();
    
    SchoolMock.expects('school.enrolment');    
    SchoolMock.expects('school.room');
    
    school.student();
    
    var _verify = SchoolMock.verify();
    
    equals(_verify.message, 'The method ROOM was not called');
});

test('Test expected method with argument', function() {
    school = {
        enrolment: function() {
            return 123;
        },
        student: function() {
            var name = 'felipe';
            this.enrolment(name);
        }
    };
    
    var SchoolMock = new Chameleon();
    
    SchoolMock.expects('school.enrolment').withArguments('felipe');    
    
    school.student();
    
    var _verify = SchoolMock.verify();
    
    ok(_verify.result, _verify.message);
});

test('Test expected method with more then one argument', function() {
    school = {
        enrolment: function() {
            return 123;
        },
        student: function() {
            var name = 'felipe';
            var surname = 'silva';
            this.enrolment(name, surname);
        }
    };
    
    var SchoolMock = new Chameleon();
    
    SchoolMock.expects('school.enrolment').withArguments('felipe', 'silva');    
    
    school.student();
    
    var _verify = SchoolMock.verify();
    
    ok(_verify.result, _verify.message);
});

test('Test reset mocked methods', function() {
    school = {
        enrolment: function() {
            return 123;
        },
        student: function() {
            this.enrolment();
        }
    };
    
    var SchoolMock = new Chameleon();
    
    SchoolMock.expects('school.enrolment');
    
    school.student();
    
    var _verify = SchoolMock.verify();
    
    SchoolMock.reset();
    
    ok(!SchoolMock.mockedMethod.enrolment, 'Removing mocked methods.');
});

test('Test expecting method with return', function() {
    school = {
        enrolment: function() {
            return 123;
        },
        student: function() {
            this.enrolment();
        }
    };
    
    var SchoolMock = new Chameleon();
    
    SchoolMock.expects('school.enrolment').andReturn(123);
    
    school.student();
    
    var _verify = SchoolMock.verify();    
    
    ok(_verify.result, _verify.message);
    equals(school.enrolment(), 123);
    
    SchoolMock.reset();
});

