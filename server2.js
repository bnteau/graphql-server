const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
        coursesByString(title: String): [Course]
    },
    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
        createNewCourse(id: Int!, title: String!, author: String, description: String, topic: String, url: String): [Course]
    },
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    },
`);

const coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
];

const getCourse = function(args) {
    const id = args.id;
    return coursesData.filter(course => {
        return course.id == id;
    })[0];
}

const getCourses = function(args) {
    if (args.topic) {
        const topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}

const getCoursesByString = function(args) {
    if (args.title) {
        const title = args.title;
        return coursesData.filter(course => course.title.indexOf(title) !== -1 && title);
    } else {
        return coursesData;
    }
}

const updateCourseTopic = function ({ id, topic }) {
    coursesData.map(course => {
        course.topic = topic;
        return course;
    });
    return coursesData.filter(course => course.id === id) [0];
}

const createNewCourse = function({ title, author, description, topic, url}) {
    const count = coursesData.length;
    const newCourse = {
        id: count+1,
        title,
        author,
        description,
        topic,
        url
    };
    coursesData.push(newCourse);
    return coursesData;
}

const root = {
    course: getCourse,
    courses: getCourses,
    coursesByString: getCoursesByString,
    updateCourseTopic: updateCourseTopic,
    createNewCourse: createNewCourse,
};

const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(4000, () => console.log('Express GraphQL Server Now Running on http://localhost:4000/graphql'));