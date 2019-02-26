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

1. A field callednpm rebuild node-sass userDatabaseName is set to "dev" and then that field variable is used later to make userDatabase from mongoClient's getDatabase() method. Then immediately after, a userController object is made that passes in userDatabase. In userController, the constructor passes in a mongo database and collects users using getCollection("users").
1. Mongo's FindIterable<Document> is assigned to the userCollection field and it uses a mongo method called find, that finds the "_id" of the user. The document is iterated over and if the user is found then they are returned.
1. The filtering by various parameters, in this instance age, works like the other labs with a few exceptions. The field that normally had the relevant data appended to it in previous labs is now a Document called filterDoc. At the end, a FindIterable<Document> passing in the filterDoc into .find() is returned through the serializeIterable function. 
1. Documents are their own class that interact with with the bson wrapper.  Looking at the Document.class documentation, Documents are essentially LinkedHashMap()'s. We use them their mapping key/value operations to achieve our filtering. 
1. clearAndPopulateDB uses the test database. It clears any possible existing userDocuments table information so that the test can run on a clean slate. From there it adds example user information for testing purposes. Then that data is used in that spec file for tests.
1. It tests if the usersDocuments table was constructed properly and that there are exactly two users who are 37 in that test set. It also checks that those users have two certain names. In this process, it is also testing the filtering by age from userController. 
1. The server's api/users/new endpoint is received by the UserRequestHandler addNewUser method that parses the request's body as a document and then retrieves informtion from key fields like name or age. Then at the end of it, it calls userController's addNewUser() method as a return field. The userController addNewUser() method appends the relevant info to a document and if succesful it inserts that newUser to the usercollection and displays a success message displaying relevant user info fields. 


## Filtering Choices

###Server Filtering Choices
1. Owner: Anybody but some sort of admin probably shouldn't have access to other peoples' todos, so a serverside filter by owner is the most realistic choice. So we would have a standalone page for a certain user and it would be filtered to just their todos.
1. Status: People are probably most concerned with their incomplete todos, so it may make sense to just serverside filter to show incompletes by default and just give the option to look at completes with some other user button or interaction. 

###Angular Filtering Choices
1. Body: Todos could have all sorts of body content. It makes sense for a user to be able to look that up easily. The body information is less personal than owner field information. Body information should only come up for todos you can see anyways by owner/status, so it's not an issue to have angular filtering. 
1. Category: Same thinking goes for category. 


