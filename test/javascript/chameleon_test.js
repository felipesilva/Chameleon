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
            enrollment: function() {
                return 123;
            },
            student: function() {
                this.enrollment();
            }
        };
    }
});

test('Test method mocked defaults', function() {
    school = {
        enrollment: function() {
            return 123;
        },
        student: function() {
            this.enrollment();
        }
    };
    
    var SchoolMock = new Chameleon(school);    
    SchoolMock.expects('enrollment');
      
    ok(!SchoolMock.mockedMethod['enrollment'].called, 'Method key "called" default value False');
});

test('Test method part of the window object', function() {

    function enrollment() {
        return 123;
    }

    school = {
        student: function() {
            enrollment();
        }
    };
    
    var SchoolMock = new Chameleon(school);
    
    SchoolMock.expects('enrollment');
      
    ok(SchoolMock.mockedMethod['enrollment'], 'Method cloned');
});

test('Test method inside a object, one level', function() {
    school = {
        enrollment: function() {
            return 123;
        },
        student: function() {
            this.enrollment();
        }
    };
    
    var SchoolMock = new Chameleon(school);
    
    SchoolMock.expects('enrollment');
      
    ok(SchoolMock.mockedMethod['enrollment'], 'Method cloned');
});

test('Test if the mocked method was called', function() {
    school = {
        enrollment: function() {
            return 123;
        },
        student: function() {
            this.enrollment();
        }
    };
    
    var SchoolMock = new Chameleon(school);
    
    SchoolMock.expects('enrollment');
    
    school.student();
    
    ok(SchoolMock.mockedMethod['enrollment'].called, 'Method was called.');
});

test('Verify methods that was not called', function() {
    school = {
        enrollment: function() {
            return 123;
        },
        student: function() {
            this.enrollment();
        }
    };
    
    var _ok = ok;
    
    window.ok = function(asset, msg){
        _ok(asset===false, msg);
    }
    
    var SchoolMock = new Chameleon(school);
    
    SchoolMock.expects('school.room');
    
    school.student();
    
    SchoolMock.verify();
    SchoolMock.reset();
    
    ok = _ok;
});

test('Verify if all mocked methods were called', function() {
    school = {
        enrollment: function() {
            return 123;
        },
        room: function() {
            return 456;
        },
        student: function() {
            this.identity = this.enrollment() + this.room();
        }
    };
    
    var SchoolMock = new Chameleon(school);
        
    SchoolMock.expects('enrollment');
    SchoolMock.expects('room');
    
    school.student();
    
    SchoolMock.verify();
    SchoolMock.reset();
});

test('Test message if all mocked methods was called', function() {
    school = {
        enrollment: function() {
            return 123;
        },
        room: function() {
            return 456;
        },
        student: function() {
            this.identity = this.enrollment() + this.room();
        }
    };
    
    var SchoolMock = new Chameleon(school);    
    SchoolMock.expects('enrollment');
    SchoolMock.expects('room');
    
    school.student();
    
    SchoolMock.verify();
});

test('Test message when a mocked methods was not called', function() {
    school = {
        enrollment: function() {
            return 123;
        },
        student: function() {
            this.enrollment();
        }
    };
    
    var _ok = ok;
    
    window.ok = function(asset, msg){
        equals('The method "room" was not called', msg);
    }
    
    var SchoolMock = new Chameleon(school);
    SchoolMock.expects('room');
    
    school.student();
    
    SchoolMock.verify();
    SchoolMock.reset();
    
    ok = _ok;
});

test('Test expected method with the wrong argument', function() {
    school = {
        enrollment: function() {
            return 123;
        },
        student: function() {
            var name = 'felipe';
            this.enrollment(name);
        }
    };
    
    var _ok = ok;
    
    window.ok = function(asset, msg){
        _ok(asset===false, 'The method enrollment expects the arguments silva');
    }
    
    
    var SchoolMock = new Chameleon(school);    
    SchoolMock.expects('enrollment').withArguments('silva');    
    
    school.student();
    
    SchoolMock.verify();
    SchoolMock.reset();
    
    ok = _ok;
});

test('Test expected method with different numbers of arguments', function() {
    school = {
        enrollment: function() {
            return 123;
        },
        student: function() {
            var name = 'felipe';
            var surname = 'silva';
            this.enrollment(name, surname);
        }
    };
    
    var _ok = ok;
    
    window.ok = function(asset, msg){
        _ok(asset===false, msg);
    }
    
    var SchoolMock = new Chameleon(school);
    SchoolMock.expects('enrollment').withArguments('felipe');    
    
    school.student();
    
    SchoolMock.verify();
    
    SchoolMock.reset();
    
    ok = _ok;
});

test('Test expected method with arguments (type objects)', function() {
    school = {
        enrollment: function() {
            return 123;
        },
        student: function() {
            var options = {name: 'felipe'};
            this.enrollment(options);
        }
    };

    
    var SchoolMock = new Chameleon(school);
    SchoolMock.expects('enrollment').withArguments({name: 'felipe'});    
    
    school.student();
    
    SchoolMock.verify();
    
    SchoolMock.reset();
});

test('Test expected method with arguments (type function)', function() {
    school = {
        enrollment: function(callback) {
            return 123;
        },
        student: function() {
            this.testargs(function(){});
        }
    };

    
    var SchoolMock = new Chameleon(school);
    SchoolMock.expects('testargs').withArguments(function(){});    
    
    school.student();
    
    SchoolMock.verify();
    
    SchoolMock.reset();
});

test('Test expected method with different arguments (type objects)', function() {
    school = {
        enrollment: function() {
            return 123;
        },
        student: function() {
            var options = {name: 'felipe'};
            this.enrollment(options);
        }
    };
    
    var _ok = ok;
    
    window.ok = function(asset, msg){
        _ok(asset===false, msg);
    }
    
    var SchoolMock = new Chameleon(school);
    SchoolMock.expects('enrollment').withArguments({name: 'vanessa'});    
    
    school.student();
    
    SchoolMock.verify();
    
    SchoolMock.reset();
    ok = _ok;
});

test('Test reset mocked methods', function() {
    school = {
        enrollment: function() {
            return 123;
        },
        student: function() {
            this.enrollment();
        }
    };
    
    var SchoolMock = new Chameleon(school);
    
    SchoolMock.expects('enrollment').andReturn(456);
    
    school.student();
    
    SchoolMock.verify();
    
    SchoolMock.reset();
    
    equals(school.enrollment(), 123);
    ok(!SchoolMock.mockedMethod.enrollment, 'Removing mocked methods.');
});

test('Test expecting method with return', function() {
    school = {
        enrollment: function() {
            return 123;
        },
        student: function() {
            this.enrollment();
        }
    };
    
    var SchoolMock = new Chameleon(school);
    
    SchoolMock.expects('enrollment').andReturn(123);
    
    school.student();
    
    SchoolMock.verify();    
    
    equals(school.enrollment(), 123);
    
    SchoolMock.reset();
});

test('Verify if all mocked methods from different objects were called', function() {
    school = {
        enrollment: function() {
            return 123;
        },
        student: function() {
            return this.enrollment();
        }
    };
    
    work = {
        enrollment: function() {
            return 123;
        },
        student: function() {
            return school.enrollment() + this.enrollment();
        }
    };
    
    var WorkMock = new Chameleon(work);
    var SchoolMock = new Chameleon(school);
        
    WorkMock.expects('enrollment');
    SchoolMock.expects('enrollment');
    
    work.student();
    
    WorkMock.verify();
    WorkMock.reset();
    
    SchoolMock.verify();
    SchoolMock.reset();
});

test('Verify if the method was called twice', function() {
    work = {
        enrollment: function() {
            return 123;
        },
        student: function() {
            return this.enrollment() + this.enrollment();
        }
    };
    
    var WorkMock = new Chameleon(work);
        
    WorkMock.expects('enrollment').times(2);
    
    work.student();
    
    WorkMock.verify();
    WorkMock.reset();
});

test('Verify if the method was called twice with the same arguments', function() {
    work = {
        enrollment: function(room) {
            return 123 + room;
        },
        student: function() {
            return this.enrollment(456) + this.enrollment(456);
        }
    };
    
    var WorkMock = new Chameleon(work);
        
    WorkMock.expects('enrollment').times(2).withArguments(456);
    
    work.student();
    
    WorkMock.verify();
    WorkMock.reset();
});

test('Verify if the method was called twice with the same returns', function() {
    work = {
        enrollment: function(room) {
            return 123;
        },
        student: function() {            
            return this.enrollment() + this.enrollment();
        }
    };
    
    var WorkMock = new Chameleon(work);
        
    WorkMock.expects('enrollment').times(2).andReturn(456);
    
    work.student();
    
    equals(school.enrollment(), 123);
    
    WorkMock.verify();    
    WorkMock.reset();
});

test('Check how many times the method enrollment was called', function() {
    work = {
        enrollment: function(room) {
            return 123;
        },
        student: function() {            
            return this.enrollment() + this.enrollment();
        }
    };
    
    var WorkMock = new Chameleon(work);
        
    WorkMock.expects('enrollment').times(2).andReturn(456);
    
    work.student();
    
    equals(school.enrollment(), 123);
    
    WorkMock.verify();    
    WorkMock.reset();
});


