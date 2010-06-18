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

    var Chameleon = function (obj) {

        function compareObjects(mockedArg, arg) {
            if (typeof mockedArg === 'object' && typeof arg === 'object') {
        	    for (var p in mockedArg) {
        	        if(typeof(mockedArg[p]) !== typeof(arg[p])) return false;
        	        if((mockedArg[p]===null) !== (arg[p]===null)) return false;
        	        switch (typeof(mockedArg[p])) {
        	            case 'undefined':
        	                if (typeof(arg[p]) != 'undefined') return false;
        	                break;
        	            case 'object':        	                
        	                if(mockedArg[p]!==null && arg[p]!==null && (mockedArg[p].constructor.toString() !== arg[p].constructor.toString() || !mockedArg[p].equals(arg[p]))) return false;
        	                break;
        	            case 'function':
        	                if (p != 'equals' && mockedArg[p].toString() != arg[p].toString()) return false;
        	                break;
        	            default:
        	                if (mockedArg[p] !== arg[p]) return false;
        	        }
        	    }
        	    return true;    	    
    	    } else if (typeof mockedArg === 'function' && typeof arg === 'function') {
    	        if (mockedArg.toString() === arg.toString()) return true;
    	    }    	    
    	        
    	    return (mockedArg === arg);
        }
        
    	function compareArgs(mockedArgs, args, mockedMethod, callback) {
    	    if (mockedArgs.length !== args.length) {
    	        callback('The method "'+ mockedMethod +'" expects "'+ mockedArgs.length +'" arguments and got "'+ args.length +'"');

                return;
    	    }
    	        
    	    for (var i=0; i<mockedArgs.length; i++) {    	                	            
                if( !compareObjects(mockedArgs[i], args[i]) ) {
                    callback('The method "'+ mockedMethod +'" expects the arguments "'+ mockedArgs[i]+ '" and got "'+ args[i] +'"');
                
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
            mockedObj: obj,
            mockedMethod: {},            
            expects: function(func) {
                var obj = this.mockedObj;
                var methodName = func;

                var _self = this;
                var mockedMethod = this.mockedMethod[methodName];
            
                this.mockedMethod[methodName] = {
                    obj: obj,
                    func: obj[methodName],
                    called: false,
                    methodTimes: 0,
                    times: function(){
                        _self.mockedMethod[methodName].expectedTimes = arguments[0];
                        
                        return _self.mockedMethod[methodName];
                    },
                    withArguments: function(){
                        _self.mockedMethod[methodName].expectedArgs = arguments;
                        
                        return _self.mockedMethod[methodName];
                    },
                    andReturn: function(){
                        _self.mockedMethod[methodName].expectedReturn = arguments[0];
                        
                        return _self.mockedMethod[methodName];
                    }
                };
            
                obj[methodName] = function() {                    
                    var _mockedMethod = _self.mockedMethod[methodName];
                     
                    _mockedMethod.called = true;
                    _mockedMethod.methodArgs = arguments;                    
                    _mockedMethod.methodTimes++;
                    
                    if (_mockedMethod.expectedReturn)
                        return _mockedMethod.expectedReturn;                
                }
            
                return this.mockedMethod[methodName];
            },
            verify: function(){                
                for(var item in this.mockedMethod) {                
                    var mockedMethod = this.mockedMethod[item];
                    
                    if (!mockedMethod.called) {
                        ok(false, 'The method "'+ item +'" was not called');
                    
                    } else if (mockedMethod.expectedTimes && (mockedMethod.methodTimes !== mockedMethod.expectedTimes)) {
                        ok(false, 'The method should be called "'+ mockedMethod.expectedTimes +'" and got "'+ mockedMethod.methodTimes +'"');
                    
                    } else if (mockedMethod.expectedArgs) {
                        compareArgs(mockedMethod.expectedArgs, mockedMethod.methodArgs, item, function(msg){
                            ok(false, msg);
                        });
                        
                    } else {
                        ok(true, 'All methods were called');
                    }
                }
            },
            reset: function() {
                for (var key in this.mockedMethod) {
                    this.mockedMethod[key].obj[key] = this.mockedMethod[key].func
                }
                this.mockedMethod = {};
            }
        };
    }

