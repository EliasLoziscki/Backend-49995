import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/Users.models.js";
import { createHash, validatePassword } from "../utils.js";
import GitHubStrategy from "passport-github2";
import MongoCartManager from "../dao/mongoManagers/MongoCartManager.js";

const LocalStrategy = local.Strategy;
const dbCartManager = new MongoCartManager();

const inicializePassport = ()=>{

    passport.use("register", new LocalStrategy(
        {passReqToCallback: true, usernameField: "email"},
        async (req, username, password, done)=>{
        const { first_name, last_name, email, age } = req.body;
            try{

                let user = await userModel.findOne({email:username});
                if(user){
                    return done(null, false,{message: "Usuario ya se registro"});
                }

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    cart: await dbCartManager.createCart(),
                    password: createHash(password),
                    rol: "user"
                }
                const result = await userModel.create(newUser);
                return done(null, result);

            }catch(error){
                return done(error);
            }
        }
    ));

    passport.use("login", new LocalStrategy({usernameField: "email"}, 
    async (username, password, done)=>{
        try{
            const user = await userModel.findOne({email: username});
            if(!user){
                return done(null, false, {message: "Usuario no encontrado"});
            }
            if(!validatePassword(password, user)){
                return done(null, false, {message: "Contraseña incorrecta"});
            }
            return done(null, user);

        }catch(error){
            return done(error);
        }
    }));
    
    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.42e218e266450e8c",
        clientSecret: "14eaa3fe4bcfceaca4c27204b08dd0c06f21eea5",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done)=>{
        try{
            console.log(profile);
            let user = await userModel.findOne({email: profile._json.email});
            if(!user){//Si el usuario no existe en la base de datos, se crea uno nuevo con los datos que se obtienen de github
                const newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    email: profile._json.email,
                    age: 18,
                    cart: await dbCartManager.createCart(),
                    password: "",
                    rol: "user"
                }
                let result = await userModel.create(newUser);
                return done(null, result);
            }else{//Si el usuario ya existe en la base de datos, se retorna el usuario encontrado en la base de datos y se loguea
                return done(null, user);
            }
            
        }catch(error){
            return done(error);
        }
    }));

    passport.serializeUser((user, done)=>{
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done)=>{
        const user = await userModel.findById(id);
        done(null, user);
    });

};

export default inicializePassport;