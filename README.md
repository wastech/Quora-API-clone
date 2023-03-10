# Quora-API-clone
> A Quora clone API was built using javascript modern tools and frameworks like [Nodejs](https://nodejs.org/en/), [Expressjs](https://expressjs.com/), and [MongoDB](https://www.mongodb.com/) and deployed to [Render](https://render.com/) ( a unified cloud to build and run all your apps and websites with free TLS certificates, global CDN, private networks and auto deploys from Git )  to make it available to users for their use

![API-EN-1](https://user-images.githubusercontent.com/56930241/224364017-314b64c2-ba5e-4c62-96e0-88a91c57f19d.png)

>APIs can be either public or private. Public APIs are open to the public and can be accessed by anyone, while private APIs are restricted to specific users or applications.

# Features
> CRUD (Create, Read, Update And Delete)

- User authentication and registration: Allow users to create an account, log in, and manage their profile
- Question and answer functionality: Enable users to ask and answer questions, and follow questions and topics of their interest
- Upvoting and downvoting: Allow users to vote on answers, comments, and questions to indicate their quality and relevance.
- Search functionality: Enable users to search for questions, topics, or users of their interest.
- Notifications: Notify users about updates to their followed questions, answers, or topics.
- Social sharing: Allow users to share questions and answers on social media platforms.
- Analytics: Provide analytics on user engagement, content performance, and other metrics to help improve the app's performance
- Admin functionality: Enable app administrators to manage user accounts, content, and settings, and to enforce community guidelines.

# API Documentation
> Hosted on Render [live](https://documenter.getpostman.com/view/9340802/2s93Jrv4Ut)

# Requirement
 - [Nodejs](https://nodejs.org/en/)
 - [Expressjs](https://expressjs.com/)
 - [MongoDB](https://www.mongodb.com/)
 - [Mongoose](https://mongoosejs.com/)
 - [JSON Web Tokens](https://jwt.io/)
 
# Configuration File
> add a new config.env into config folder, then modify to your environment variables, mongodb uri, set your JWT_SECRET and SMTP variables
```
NODE_ENV=development
PORT=5000

MONGO_URI=
MONGO_URI_LOCAL=
MONGO_USERNAME=
MONGO_PASSWORD=



FILE_UPLOAD_PATH= ./public/uploads
MAX_FILE_UPLOAD=1000000

JWT_SECRET=kjhguiokss
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=
SMTP_EMAIL=
SMTP_PASSWORD=
FROM_EMAIL=
FROM_NAME=

```

# Installation

Install all the dependecies

```yarn ```

Install nodemon globally
``` npm install -g nodemon ```

# Start web server

``` yarn dev ```

# Images
![Screenshot 2023-03-10 184847](https://user-images.githubusercontent.com/56930241/224388916-a62c9330-e881-4096-b95f-e4b755f64fa3.png)


![Screenshot 2023-03-10 184920](https://user-images.githubusercontent.com/56930241/224388876-aa48f534-a55a-4942-b956-93ce6c19eb50.png)



