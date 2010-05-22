module('Chameleon Tests', {
    setup: function(){
        var school = {
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
    var school = {
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

test('Test if the mocked method was called', function() {
    var school = {
        enrolment: function() {
            return 123;
        },
        student: function() {
            this.enrolment();
        }
    };
    
    var SchoolMock = new Chameleon(school);
    
    SchoolMock.expects('enrolment');
    
    school.student();
    
    ok(SchoolMock.mockedMethod['enrolment'].called, 'Method was called.');
});

test('Verify methods that was not called', function() {
    var school = {
        enrolment: function() {
            return 123;
        },
        student: function() {
            this.enrolment();
        }
    };
    
    var SchoolMock = new Chameleon(school);
    
    SchoolMock.expects('enrolment');
    SchoolMock.expects('room');
    
    school.student();
    
    SchoolMock.verify();
    
    ok(SchoolMock.verify().result === false, SchoolMock.verify().message);
});

test('Verify if all mocked methods was called', function() {
    var school = {
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
    
    var SchoolMock = new Chameleon(school);
    
    SchoolMock.expects('enrolment');
    SchoolMock.expects('room');
    
    school.student();
    
    var _verify = SchoolMock.verify();

    ok(_verify.result, _verify.message);
});

test('Test message if all mocked methods was called', function() {
    var school = {
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
    
    var SchoolMock = new Chameleon(school);
    
    SchoolMock.expects('enrolment');
    SchoolMock.expects('room');
    
    school.student();
    
    var _verify = SchoolMock.verify();
    
    equals(_verify.message, 'All methods was called');
});

test('Test message when a mocked methods was not called', function() {
    var school = {
        enrolment: function() {
            return 123;
        },
        student: function() {
            this.enrolment();
        }
    };
    
    var SchoolMock = new Chameleon(school);
    
    SchoolMock.expects('enrolment');    
    SchoolMock.expects('room');
    
    school.student();
    
    var _verify = SchoolMock.verify();
    
    equals(_verify.message, 'The method ROOM was not called');
});

test('Test expected method with argument', function() {
    var school = {
        enrolment: function() {
            return 123;
        },
        student: function() {
            var name = 'felipe';
            this.enrolment(name);
        }
    };
    
    var SchoolMock = new Chameleon(school);
    
    SchoolMock.expects('enrolment').withArguments('felipe');    
    
    school.student();
    
    var _verify = SchoolMock.verify();
    
    ok(_verify.result, _verify.message);
});

test('Test expected method with more then one argument', function() {
    var school = {
        enrolment: function() {
            return 123;
        },
        student: function() {
            var name = 'felipe';
            var surname = 'silva';
            this.enrolment(name, surname);
        }
    };
    
    var SchoolMock = new Chameleon(school);
    
    SchoolMock.expects('enrolment').withArguments('felipe', 'silva');    
    
    school.student();
    
    var _verify = SchoolMock.verify();
    
    ok(_verify.result, _verify.message);
});

test('Test reset mocked object', function() {
    var school = {
        enrolment: function() {
            return 123;
        },
        student: function() {
            this.enrolment();
        }
    };
    
    var SchoolMock = new Chameleon(school);
    
    SchoolMock.expects('enrolment');
    
    school.student();
    
    var _verify = SchoolMock.verify();
    
    SchoolMock.reset();
    
    equals(school.enrolment, SchoolMock.mockedObject.enrolment);
    ok(!SchoolMock.mockedMethod.enrolment, 'Removing mocked methods.');
});

test('Test expecting method with return', function() {
    var school = {
        enrolment: function() {
            return 123;
        },
        student: function() {
            this.enrolment();
        }
    };
    
    var SchoolMock = new Chameleon(school);
    
    SchoolMock.expects('enrolment').andReturn(456);
    
    school.student();
    
    var _verify = SchoolMock.verify();
    
    SchoolMock.reset();
    
    console.log(_verify.result, _verify.message)
    
    ok(_verify.result, _verify.message);
});

