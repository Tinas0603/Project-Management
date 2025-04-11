import passport from "passport";
import { Request } from "express";
import { Strategy as GoogleStrategy, Strategy } from "passport-google-oauth20";
import { config } from "./app.config";
import { NotFoundException } from "../utils/appError";
import { ProviderEnum } from "../enums/account-provider.enum";
import { Strategy as LocalStrategy } from "passport-local";
import { findUserByIdService, loginOrCreateAccountService, verifyUserService } from "../services/auth.service";
import { signJwtToken } from "../utils/jwt";
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt";


passport.use(
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: config.GOOGLE_CALLBACK_URL,
            scope: ["profile", "email"],
            passReqToCallback: true,
        },
        async (req: Request, accessToken, refreshToken, profile, done) => {
            try {
                const { email, sub: googleId, picture } = profile._json;
                console.log(profile, "profile");
                console.log(googleId, "googleId");
                if (!googleId) {
                    throw new NotFoundException("Google ID (sub) is missing");
                }
                const { user } = await loginOrCreateAccountService({
                    provider: ProviderEnum.GOOGLE,
                    displayName: profile.displayName,
                    providerId: googleId,
                    picture: picture,
                    email: email,
                });
                const jwt = signJwtToken({ userId: user._id });
                req.jwt = jwt;
                done(null, user);
            } catch (error) {
                done(error, false);
            }
        }
    )
);

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            //cần set lại false
            session: false,
        },
        async (email, password, done) => {
            try {
                const user = await verifyUserService({ email, password });
                return done(null, user);
            } catch (error: any) {
                return done(error, false, { message: error?.message });
            }
        }
    )
);

interface JwtPayload {
    userId: string;
}

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT_SECRET,
    audience: ["user"],
    algorithms: ["HS256"],
};

passport.use(
    new JwtStrategy(options, async (payload: JwtPayload, done) => {
        try {
            const user = await findUserByIdService(payload.userId);
            if (!user) {
                return done(null, false);
            }
            done(null, user);

        } catch (error) {
            return done(error, false);
        }
    })
);


// Lưu toàn bộ thông tin user vào session
passport.serializeUser((user: any, done) => done(null, user));
// Lấy thông tin user từ session để sử dụng cho Request hoặc các middleware khác
passport.deserializeUser((user: any, done) => done(null, user));


export const passportAuthenticateJWT = passport.authenticate("jwt", {
    session: false,
})
