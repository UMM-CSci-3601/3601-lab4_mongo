## Questions

1. :question: What do we do in the `Server` and `UserController` constructors
to set up our connection to the development database?
1. :question: How do we retrieve a user by ID in the `UserController.getUser(String)` method?
1. :question: How do we retrieve all the users with a given age 
in `UserController.getUsers(Map...)`? What's the role of `filterDoc` in that
method?
1. :question: What are these `Document` objects that we use in the `UserController`? 
Why and how are we using them?
1. :question: What does `UserControllerSpec.clearAndPopulateDb` do?
1. :question: What's being tested in `UserControllerSpec.getUsersWhoAre37()`?
How is that being tested?
1. :question: Follow the process for adding a new user. What role do `UserController` and 
`UserRequestHandler` play in the process?

## Your Team's Answers

1. The UserController accepts a database as a parameter, which is constructed in the server.
1. Search through an iterable json document in this case, jsonUsers, and search through the 
field "_id".
1. filterDoc is essentially a temporary storage of all the items that fit the filter 
parameters.  It queries the list of documents for ones that have an age that matches
the key.  It then copies them into the filterDoc which is then returned to show all matching
documents that pertain to the search.
1. They are new json documents that are written into the directory.  Mongo works with 
json-like objects so that we make things that it can communicate with.
1. It tests the clearing and populating effects of UserController by creating a "database"
and then testing against that "database".
1. It is checking that the getUsers gets the correct number of users that matches the search
filter, in this case it is users with age 37.  It tests against the previously created fake 
database with 3 users.  The test checks that two are filtered with these parameters.
1. UserController has the actual method that handles the creation of the document and 
appending to the database, userCollection.  UserRequestHandler handles the request from the
server and calls the function UserController.addNewUser sending the relevant information to
create the new user.
