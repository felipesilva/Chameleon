# chameleon - version 0.1
a javascript mocking library

# dependencies
you'll need those dependencies in order to run chameleon's tests

[ruby](http://ruby-lang.org/) and [rubygems](http://rubygems.org/)

and hanoi gem:

    [sudo] gem install hanoi

# running the tests

    rake test:js

# usage

    todo

# todo

* usage
* an argument to the withArguments function that will represent that the author of the test wants to ignore the check of the argument
* a new syntax that won't require the creation of a Chameleon Object for each mocked object, something like this
        
        var c = new Chameleon;
        c.expects('global.method').withArguments(456);
        c.expects(localObj, 'method').withArguments(456);
        c.verify();
        c.reset();