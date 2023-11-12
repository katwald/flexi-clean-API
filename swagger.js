const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Rest API DOCS",
      version: "1.0.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
    },
    servers: [
      {
        url: "http://localhost:3001",
      },
    ],
    components: {
      schemas: {
        Booking: {
          type: "object",
          required: ["venueName", "bookingStatus", "cleaningStatus"],
          properties: {
            venueName: {
              type: "string",
              description: " name of the venue",
              default: "venue one",
            },
            bookingStatus: {
              type: "object",
              properties: {
                bookingStart: {
                  type: "String",
                  description: "Check in date",
                },
                bookingEnd: {
                  type: "string",
                  description: "Check out date",
                },
                bookingDescription: {
                  type: "string",
                  description: " Additional information of booking",
                },
                cleaningDate: {
                  type: "string",
                  description: "cleaning date after checkout",
                },
              },
            },
            cleaningStatus: {
              type: "object",
              properties: {
                cleanedDate: {
                  type: "string",
                  description:
                    "Date when the venue has been cleaned after checkout",
                },
                assignedCleaner: {
                  type: "string",
                  description: "Asignend cleaner fullName",
                },
                cleaningStatus: {
                  type: "string",
                  description:
                    "status tag such as ONGOING, NOTSTARTED, FINISHED",
                },
                cleaningHour: {
                  type: "number",
                  description: "number of hour took to finish the job",
                },
              },
            },
            comments: {
              types: "array",
              description: " comment made by some one",
            },
          },
        },
        User: {
          type: "object",
          required: ["firstName", "email", "password", "role"],
          properties: {
            firstName: {
              type: "string",
              description: "first name",
            },
            lastName: {
              type: "string",
              description: "last name",
            },
            email: {
              type: "string",
              description: "email",
            },
            password: {
              type: "string",
              description: "password",
            },
            role: {
              type: "string",
              description: "role",
            },
          },
        },
      },
      responses: {
        400: {
          description: "missing api key - include it in the auth header",
          contents: "application/json",
        },
        401: {
          description: "missing api key - include it in the auth header",
          contents: "application/json",
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [],
  },
  apis: ["./controllers/*.js"],
};

module.exports = options;
