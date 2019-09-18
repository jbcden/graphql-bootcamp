const users = [{
    id: '1',
    name: 'Jacob',
    email: 'jacob@example.com',
    age: 27
}, {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com'
}, {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com'
}]

const posts = [{
    id: '1',
    title: 'My first post!',
    body: 'I do not have much to say',
    published: true,
    author: '1'
}, {
    id: '2',
    title: 'What is a post?',
    body: 'Not this',
    published: false,
    author: '1'
}, {
    id: '3',
    title: 'SQL all the things!',
    body: 'select * from things;',
    published: true,
    author: '2'
}]

const comments = [{
    id: '1',
    text: 'This is a nice comment!',
    author: '2',
    post: '1'
},
{
    id: '2',
    text: 'This sucks!',
    author: '2',
    post: '2'
},
{
    id: '3',
    text: "Can't we all be friends?!?",
    author: '3',
    post: '2'
},
{
    id: '4',
    text: 'I just want to sleep',
    author: '3',
    post: '3'
}]

const db = {
  users,
  posts,
  comments
}

export { db as default }
