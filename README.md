## DAMP test runner for git repos

This is a sketch for a test runner that will run talos DAMP tests for firefox devtools developed in
separate git repositories.

what this does:

* allows you to run damp tests from the github project
* allows you to specify a series of commits that you want to run
* allows you to compare previously run commits

flags:

--target is where your firefox install is located. if it is located in your debugger directory you would do something like this: --target ./firefox

--commits here you specify the commits you want to run. each commit is separate. for example
--commits df2cd2fa55e79a6f69f72aeab5828b75cb06a126 3741eeb267fd2f0a1b42107389e31d3887798957 b800f2eb6f575622ade6448307b5151db385274c

this would run and compare these three commits

--from allows you to specify a first commit from which to walk up the git log

--to allows you to specify a last commit were to end, can only be used with from
