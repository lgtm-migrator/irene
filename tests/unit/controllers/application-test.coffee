`import { test, moduleFor } from 'ember-qunit'`

moduleFor 'controller:application', 'ApplicationController', {
  # Specify the other units that are required for this test.
  needs: ['helper:start-app']
}

# Replace this with your real tests.
test 'it exists', ->
  controller = @subject()
  ok controller

