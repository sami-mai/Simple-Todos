/* eslint-env mocha */

import {
  Meteor
} from 'meteor/meteor';
import {
  Random
} from 'meteor/random';
import {
  assert
} from 'chai';

import {
  Tasks
} from './tasks.js';

if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      const username = 'sami-mai';
      let taskId;
      let userId;

      before(() => {
        let user = Meteor.users.findOne({username: username});
        if (!user) {
          userId = Accounts.createUser({
            'username': username,
            'email': 'sam@mai.com',
            'password': '0101010',
          }); 
        } else {
          userId = user._id;
        }

      });

      beforeEach(() => {
        Tasks.remove({});
        taskId = Tasks.insert({
          text: 'test task',
          createdAt: new Date(),
          owner: userId,
          username: 'tmeasday',
        });
      });

      // test 'tast.remove' method
      it('can delete owned task', () => {
        // Find the internal implementation of the task method so we can
        // test it in isolation
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];

        // Set up a fake method invocation that looks like what the method expects
        const invocation = {
          userId
        };

        // Run the method with `this` set to the fake invocation
        deleteTask.apply(invocation, [taskId]);

        // Verify that the method does what we expected
        assert.equal(Tasks.find().count(), 0);
      });

      //  test 'tasks.insert' method
      it('can insert task', () => {
        let text = 'Insert new task';
        const insertTask = Meteor.server.method_handlers['tasks.insert'];
        // caution Error: Meteor.userId can only be invoked in method calls or publications.
        const invocation = {
          userId
        };
        insertTask.apply(invocation, [text]);
        assert.equal(Tasks.find().count(), 2);
      });


    });
  });
}