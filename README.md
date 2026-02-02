Urban Ideas – Angular Application

Urban Ideas is an application developed using Angular that allows the management of users and posts through the public GoREST REST APIs.
This project was created as the final application of the Angular Course, with the goal of practicing authentication, routing, HTTP services, state handling, and testing.

⸻

Technologies Used
• Angular 21 (standalone components)
• Angular Router
• Angular Forms
• Angular HttpClient
• RxJS
• Vitest for unit testing
• GoREST Public API (https://gorest.co.in/)
• Git & GitHub

No external UI frameworks such as Bootstrap, PrimeNG, or Angular Material were used.
The main focus of the project is functionality and application architecture.

⸻

Authentication

The application uses Bearer Token authentication.

To access the application: 1. Generate a personal token from the official GoREST page
https://gorest.co.in/consumer/login 2. Enter the token in the application login screen 3. The token is stored in sessionStorage and used:
• to protect routes via an Auth Guard
• to authorize all HTTP requests to the APIs

All application features are protected by authentication.

⸻

Main Features

Login
• Access via GoREST token
• Route protection using Auth Guard
• Automatic redirect when the token is missing or invalid

⸻

Users List
• Display of users list
• Pagination
• Selection of users per page (5 / 10 / 20 / 50)
• Search users by name or email
• Create a new user
• Delete an existing user
• Access to the user detail page

⸻

User Detail Page
• Display of all user information
• List of posts associated with the selected user
• Display of comments for each post
• Ability to add new comments to posts

⸻

Posts List
• Display of all posts in the system
• Search posts
• View post comments
• Create new posts
• Add new comments to posts

⸻

Logout
• Removal of the token from the session
• Automatic redirect to the login page

⸻

Architecture
• Application built using standalone components
• Clear separation between:
• Components
• Services
• Guards
• Centralized routing with protected routes
• HTTP communication handled through dedicated services
• Lazy loading of components using loadComponent

⸻

Testing

Unit tests have been implemented for:
• Services
• Authentication Guard
• Main components

Test coverage exceeds 60%, as required by the project guidelines.

To run tests:
npm test

⸻

Running the Project Locally 1. Clone the repository:
git clone https://github.com/treccaniandrea6-prog/urban-ideas-angular.git 2. Enter the project folder:
cd urban-ideas-angular 3. Install dependencies:
npm install 4. Start the development server:
npm start

The application will be available at:
http://localhost:4200

⸻

Final Notes

The project was developed following Angular best practices, with particular attention to:
• code clarity
• separation of responsibilities
• correct usage of services
• authentication management
• testing

The UI design was not the primary focus, but the interface is clean, simple, and functional.

⸻

GitHub Repository

Public repository:
https://github.com/treccaniandrea6-prog/urban-ideas-angular
