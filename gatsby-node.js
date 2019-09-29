const path = require("path")

const makeRequest = (graphql, request) =>
  new Promise((resolve, reject) => {
    //query for nodes to use in creating pages
    resolve(
      graphql(request).then(result => {
        if (result.errors) {
          reject(result.errors)
        }

        return result
      })
    )
  })

//implement the gatsby api "createPages". This is called once the
//data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  const getArticles = makeRequest(
    graphql,
    `
       {
           allStrapiArticle {
               edges {
                   node {
                       id
                   }
               }
           }
       }
      `
  ).then(result => {
    //create pages for each article
    result.data.allStrapiArticle.edges.forEach(({ node }) => {
      createPage({
        path: `/${node.id}`,
        component: path.resolve(`src/templates/article.js`),
        context: {
          id: node.id,
        },
      })
    })
  })

  const getAuthors = makeRequest(
    graphql,
    `
  {
      allStrapiUser {
          edges {
              node {
                  id
              }
          }
      }
  }
  `
  ).then(result => {
    //create pages for each user
    result.data.allStrapiUser.edges.forEach(({ node }) => {
      createPage({
        path: `/authors/${node.id}`,
        component: path.resolve(`src/templates/author.js`),
        context: {
          id: node.id,
        },
      })
    })
  })
  // query for articles and authors nodes to use in creating pages;

  return Promise.all([getArticles, getAuthors]);
}
