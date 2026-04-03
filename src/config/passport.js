const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const MicrosoftStrategy = require('passport-azure-ad').BearerStrategy;

// Configure Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    // Logic to handle user login or registration
    return done(null, profile);
}));

// Configure GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
    // Logic to handle user login or registration
    return done(null, profile);
}));

// Configure Microsoft Strategy
passport.use(new MicrosoftStrategy({
    identityMetadata: `https://login.microsoftonline.com/<tenant>/v2.0/.well-known/openid-configuration`,
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    responseType: 'token',
    responseMode: 'query',
    scope: ['email', 'profile'],
    callbackURL: '/auth/microsoft/callback'
}, (accessToken, refreshToken, params, profile, done) => {
    // Logic to handle user login or registration
    return done(null, profile);
}));

module.exports = passport;