const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const typeDefs = fs.readFileSync(
    path.join(__dirname, "./schemas/links/links.graphql"),
    "utf-8"
)

const resolvers = {
    Query: {
        feed: async(parent, args, context) => {
            return await context.prisma.link.findMany();
        }
    },
    Mutation: {
        createLink: async(parent, args, context) => {
            const newLink = await context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description
                }
            })
            return newLink;
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
        prisma
    }
})

server.listen()
      .then(({url}) => console.log(`Server started on ${url} url`));