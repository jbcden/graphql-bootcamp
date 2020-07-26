import uuidv4 from 'uuid/v4'

const Mutation = {
  createUser(parent, { data }, { db }, info) {
    const { name, email, age } = data
    const emailTaken = db.users.some((user) => {
      return user.email == email
    })

    if (emailTaken) {
      throw new Error('Email taken')
    }

    const user = {
      id: uuidv4(),
      ...data
    }

    db.users.push(user)

    return user
  },
  deleteUser(parent, { id }, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id == id)

    if (userIndex == -1) {
      throw new Error('User not found')
    }

    const [deletedUser] = db.users.splice(userIndex, 1)

    db.posts = db.posts.filter((post) => {
      const match = post.author == id

      if (match) {
        db.comments = db.comments.filter((comment) => comment.post !== post.id)
      }

      return !match
    })

    db.comments = db.comments.filter((comment) => comment.author !== id)

    return deletedUser
  },
  updateUser(parent, { id, data }, { db }, info) {
    const user = db.users.find((user) => user.id === id)

    if (!user) {
      throw new Error('User not found')
    }

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some((user) => user.email == data.email)

      if (emailTaken) {
        throw new Error('Email taken')
      }

      user.email = data.email
    }

    if (typeof data.name === 'string') {
      user.name = data.name
    }

    if (typeof data.age !== 'undefined') {
      user.age = data.age
    }

    return user
  },
  createPost(parent, { data }, { db, pubsub }, info) {
    const { title, body, published, author} = data
    const userExists = db.users.some((user) => user.id == author)

    if (!userExists) {
      throw new Error('User not found')
    }

    const post = {
      id: uuidv4(),
      ...data
    }
    db.posts.push(post)
    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post
        }
      })
    }

    return post
  },
  deletePost(parent, { id }, { pubsub, db }, info) {
    const postIndex = db.posts.findIndex((post) => post.id == id)

    if (postIndex == -1) {
      throw new Error('Post not found')
    }

    db.comments = db.comments.filter((comment) => {
      const match = comment.post == id

      return !match
    })

    const [deletedPost] = db.posts.splice(postIndex, 1)

    if (deletedPost.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
            data: deletedPost
        }
      })
    }

    return deletedPost
  },
  updatePost(parent, { id, data }, { db, pubsub }, info) {
    const post = db.posts.find((post) => post.id === id)
    const originalPost = { ...post }

    if (!post) {
      throw new Error('Post not found')
    }

    if (typeof data.title === 'string') {
      post.title = data.title
    }

    if (typeof data.body === 'string') {
      post.body = data.body
    }

    if (typeof data.published === 'boolean') {
      post.published = data.published

      if (originalPost.published && !post.published) {
        // deleted
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost
          }
        })
      } else if (!originalPost.published && post.published) {
        // created
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        })
      } else if (originalPost.published === post.published) {
        // updated
        pubsub.publish('post', {
          post: {
            mutation: 'UPDATED',
            data: post
          }
        })
      }
    } else if (post.published) {
      // updated
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post
        }
      })
    }

    return post
  },
  createComment(parent, { data }, { db, pubsub }, info) {
    const { text, author, post } = data
    const userExists = db.users.some((user) => user.id == author)

    if (!userExists) {
      throw new Error('User not found')
    }

    const postValid = db.posts.some((p) => p.id == post && p.published == true)

    if (!postValid) {
      throw new Error('Post is not valid')
    }

    const comment = {
      id: uuidv4(),
      ...data
    }

    db.comments.push(comment)
    pubsub.publish(`comment:${data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment
      }
    })

    return comment
  },
  deleteComment(parent, { id }, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex((comment) => comment.id == id)

    if (commentIndex === -1) {
      throw new Error('Comment not found')
    }

    const [deletedComment] = db.comments.splice(commentIndex, 1)
    
    pubsub.publish(`comment:${deletedComment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: deletedComment
      }
    })

    return deletedComment
  },
  updateComment(parent, { id, data }, { db, pubsub }, info) {
    const comment = db.comments.find((comment) => comment.id === id)

    if (!comment) {
      throw new Error('Comment not found')
    }

    if (typeof data.text === 'string') {
      comment.text = data.text
    }

    pubsub.publish(`comment:${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    })

    return comment
  }
}

export { Mutation as default }
