
    var Chameleon = function () {

    	function compareArgs(mockedArgs, args, callback) {
    	    for (var i=0; i<mockedArgs.length; i++) {
                if( !(mockedArgs[i] === args[i]) ) {
                    callback(mockedArgs[i]);
                
                    return;
                };
            }
    	}
    	
    	function namespace(str) {
    	    var _arr = str.split('.');
    	    
    	    if (_arr.length === 1) 
    	        return {obj: window, methodName: _arr[0]};
    	    
            return {obj: window[_arr[0]], methodName: _arr[1]};
    	}

        return {
            mockedMethod: {},
            expects: function(str) {
                var n = namespace(str);
                var obj = n.obj;
                var methodName = n.methodName;
            
                var _self = this;
                var mockedMethod = this.mockedMethod[methodName];
            
                this.mockedMethod[methodName] = {
                    called: false,
                    withArguments: function(){
                        _self.mockedMethod[methodName].mockedArgs = arguments;
                    },
                    andReturn: function(){
                        _self.mockedMethod[methodName].mockedReturn = arguments[0];
                    }
                };
            
                obj[methodName] = function() {     
                    _self.mockedMethod[methodName].called = true;
                    _self.mockedMethod[methodName].methodArgs = arguments;
                }
            
                return this.mockedMethod[methodName];
            },
            verify: function(){   
                var _verify = {
                    result: true,
                    message: 'All methods was called'
                };
            
                for(var item in this.mockedMethod) {                
                    var mockedMethod = this.mockedMethod[item];

                    if (!mockedMethod.called) {
                        _verify.result = false;
                        _verify.message = 'The method '+ item.toUpperCase() +' was not called';
                    
                        return _verify;
                    };                                
                
                    if (mockedMethod.mockedReturn) {
                        if ( !(mockedMethod.mockedReturn === mockedMethod.methodReturn) ) {
                            _verify.result = false;
                            _verify.message = 'The method '+ item.toUpperCase() +' was called but returns '+ mockedMethod.methodReturn + ' and is expected ' + mockedMethod.mockedReturn;
                    
                            return _verify;
                        };
                    }
                
                    if (mockedMethod.mockedArgs) {
                        compareArgs(mockedMethod.mockedArgs, mockedMethod.methodArgs, function(arg){
                            _verify.result = false;
                            _verify.message = 'The method '+ item.toUpperCase() +' expects the arguments '+ arg;
                        
                            return _verify;
                        });
                    };
                }
            
                return _verify;
            },
            reset: function() {
                this.mockedMethod = {};
            }
        };
    }

