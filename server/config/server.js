module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'f6b03a88ea9fedb5bcdcf0f4d8b4c476'),
    },
  },
});
