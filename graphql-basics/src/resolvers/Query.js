const Query = {
  posts(parent, { query },  { db }, info) {
    if (!query) {
      return db.posts
    }

    return db.posts.filter((post) => {
      let queryString = query.toLowerCase()
      return post.title.toLowerCase().includes(queryString) ||
        post.body.toLowerCase().includes(queryString)
    })
  },
  users(parent, { query }, { db }, info) {
    if (!query) {
      return db.users
    }

    return db.users.filter((user) => {
      return user.name.toLowerCase().includes(query.toLowerCase())
    })
  },
  me() {
    return {
      id: 'abc123',
      name: 'Mike',
      email: 'mike@example.com'
    }
  },
  post() {
    return {
      id: 'post1',
      title: 'A lengthy discourse on databases',
      body: 'Some info',
      published: false
    }
  },
  comments(parents, args, { db }, info) {
    return db.comments
  }
}

export { Query as default }
