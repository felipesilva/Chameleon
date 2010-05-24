/**
Copyright (c) <2010> Felipe Silva <felipef.silva@gmail.com>

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
    
    var _ok = ok;
    
    window.ok = function(asset, msg){
        _ok(asset===false, msg);
    }
    
    var SchoolMock = new Chameleon();
    
    SchoolMock.expects('school.room');
    
    school.student();
    
    SchoolMock.verify();
    SchoolMock.reset();
    
    ok = _ok;
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
    
    SchoolMock.verify();
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
    
    SchoolMock.verify();
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
    
    var _ok = ok;
    
    window.ok = function(asset, msg){
        equals('The method ROOM was not called', msg);
    }
    
    var SchoolMock = new Chameleon();
    SchoolMock.expects('school.room');
    
    school.student();
    
    SchoolMock.verify();
    SchoolMock.reset();
    
    ok = _ok;
});

test('Test expected method with the wrong argument', function() {
    school = {
        enrolment: function() {
            return 123;
        },
        student: function() {
            var name = 'felipe';
            this.enrolment(name);
        }
    };
    
    var _ok = ok;
    
    window.ok = function(asset, msg){
        _ok(asset===false, 'The method ENROLMENT expects the arguments silva');
    }
    
    
    var SchoolMock = new Chameleon();    
    SchoolMock.expects('school.enrolment').withArguments('silva');    
    
    school.student();
    
    SchoolMock.verify();
    SchoolMock.reset();
    
    ok = _ok;
});

test('Test expected method with different numbers of arguments', function() {
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
    
    var _ok = ok;
    
    window.ok = function(asset, msg){
        _ok(asset===false, msg);
    }
    
    var SchoolMock = new Chameleon();
    SchoolMock.expects('school.enrolment').withArguments('felipe');    
    
    school.student();
    
    SchoolMock.verify();
    
    SchoolMock.reset();
    
    ok = _ok;
});

test('Test expected method with arguments (type objects)', function() {
    school = {
        enrolment: function() {
            return 123;
        },
        student: function() {
            var options = {name: 'felipe'};
            this.enrolment(options);
        }
    };

    
    var SchoolMock = new Chameleon();
    SchoolMock.expects('school.enrolment').withArguments({name: 'felipe'});    
    
    school.student();
    
    SchoolMock.verify();
    
    SchoolMock.reset();
});

test('Test expected method with different arguments (type objects)', function() {
    school = {
        enrolment: function() {
            return 123;
        },
        student: function() {
            var options = {name: 'felipe'};
            this.enrolment(options);
        }
    };
    
    var _ok = ok;
    
    window.ok = function(asset, msg){
        _ok(asset===false, msg);
    }
    
    var SchoolMock = new Chameleon();
    SchoolMock.expects('school.enrolment').withArguments({name: 'vanessa'});    
    
    school.student();
    
    SchoolMock.verify();
    
    SchoolMock.reset();
    ok = _ok;
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
    
    SchoolMock.expects('school.enrolment').andReturn(456);
    
    school.student();
    
    SchoolMock.verify();
    
    SchoolMock.reset();
    
    equals(school.enrolment(), 123);
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
    
    SchoolMock.verify();    
    
    equals(school.enrolment(), 123);
    
    SchoolMock.reset();
});

test('Verify if all mocked methods from different objects was called', function() {
    school = {
        enrolment: function() {
            return 123;
        },
        student: function() {
            return this.enrolment();
        }
    };
    
    work = {
        enrolment: function() {
            return 123;
        },
        student: function() {
            return school.enrolment() + this.enrolment();
        }
    };
    
    var WorkMock = new Chameleon();
        
    WorkMock.expects('school.enrolment');
    WorkMock.expects('work.enrolment');
    
    work.student();
    
    WorkMock.verify();
});