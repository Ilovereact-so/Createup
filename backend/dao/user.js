const db = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const user = require('../service/user');
const randomToken = require('random-token');
const e = require('express');
const { useState } = require('react');

class userDAO {
async loginUser(password, userdata, usertype){
    console.log(usertype, userdata)
    
    async function check() {
      
      if(usertype == 'email'){
        const [DB] = await db('users')
        .where({email: userdata})
        //console.log("email", DB)
        if(DB != null){
          return login(DB)
        }else{
          return false
        }
        
      }else{
        //let huj = "niga"
        const [DB] = await db('users')
        .where({username : userdata})
        //console.log("username", DB)
        if(DB != null){
          return login(DB)
        }else{
          return false
        }
      }
    }
    async function login(DB){
      //console.log('true')
      return bcrypt.compare(password, DB.password).then(function(result) {
        //console.log(result)
        if(result == true){
          //getAccess_token()
          return getAccess_token(DB.id)
        }else{
          return false
        }
      });
      
    }

    async function getAccess_token(user_id){
      var payload = {
        user_id:user_id,
        rt_id: 0
      };
      var secret = 'kurwakurwaKondzioCwelkurwakurwa';
      const access_token = jwt.encode(payload, secret, 'HS512');
      await db('oauth_access_tokens')
      .insert({user_id, access_token})
      //console.log(tokens_db.access_token)

      return access_token
    }

    return check()
    
  }

  async signupUser(username, email, hashPassword){
    const password = bcrypt.hashSync(hashPassword, 8)
    const [user_id] = await db('users')
    .insert({email : email, username : username, password : password})

    var payload = {
      user_id:user_id,
      rt_id: null
    };
    var secret = 'kurwakurwaKondzioCwelkurwakurwa';

    const access_token = jwt.encode(payload, secret, 'HS512');
    const [id_token] = await db('oauth_access_tokens')
    .insert({user_id, access_token})

    return {id_token, access_token}
    
  }

  async authUser(access_token){
    
    var secret = '';
    const Jwtdecode = () => {
      try {
        return jwt.decode(access_token, secret, 'HS512');
      } catch (e) {
        console.log("err")
        return false;
      } 
    };
    if(Jwtdecode() == false)
    {
      //console.log(Jwtdecode())
      return false
    }else{
      const res = Jwtdecode();
      console.log(res?.user_id,"json")
      const [oat] = await db("oauth_access_tokens")
      .where({access_token:access_token, user_id:res?.user_id})
      console.log(oat, "oat", res, "res")
      if(oat != null) {
        return getRefreshToken({access_token, decoded:res})
      }else{
        return false
      }
    }
    

    // jwt.decode(access_token, secret, 'HS512')
    // .then(async (res)=>{
      
      
    // })
    // .catch((err)=>{
    //   return false
    // });
    

    async function getRefreshToken({access_token, decoded}) {
      console.log(decoded,"niga")
      if( await db("oauth_access_tokens").where({access_token:access_token, user_id:decoded?.user_id}).del()){
        await db("oauth_refresh_tokens").where({id: decoded?.rt_id}).del()
        
        const [user_data] = await db('users')
        .where({id: decoded?.user_id})
        var payload_user = {
          username : user_data?.username,
          email : user_data?.email
        }
        var ss = randomToken(16);
        const refresh_token = jwt.encode(payload_user, ss, 'HS512');
        const [rt_id] = await db("oauth_refresh_tokens")
        .insert({refresh_token})

        var payload = {
          user_id: await decoded?.user_id,
          rt_id: rt_id
        }
        const new_access_token = jwt.encode(payload, ss, 'HS512');
        
        await db("oauth_access_tokens")
        .insert({access_token: new_access_token, user_id:decoded.user_id})

        const return_data = {at : new_access_token, rt: refresh_token}
  
        return return_data
      }
      
    }
  }

  async checkAccount(username, email) {
    const [Cusername] = await db('users')
    .where({username})
    const [Cemail] = await db('users')
    .where({email})

    if(Cusername == null && Cemail == null){
        return false
    }else if(Cusername != null){
        return 'username'
    }else if(Cemail != null){
        return 'email'
    }
    
  }

  async searchAccount(username, email) {
    const [Cusername] = await db('users')
    .where({username})
    const [Cemail] = await db('users')
    .where({email})

    if(Cusername == null && Cemail == null){
        return true
    }else if(Cusername != null ){
        return 'username'
    }else if(Cemail != null){
        return 'email'
    }
    
  }

  async logoutUser(at, rt) {
    const [db_at] = await db('oauth_access_tokens')
    .where({access_token: at})
    const [db_rt] = await db('oauth_refresh_tokens')
    .where({refresh_token: rt})

    if(db_at != null && db_rt != null){
      await db('oauth_access_tokens').where({access_token: at}).del()
      await db('oauth_refresh_tokens').where({refresh_token: rt}).del()
      return true
    }else {
      return false
    }
    
  }

  async viewProject(access_token){
    const [db_at] = await db('oauth_access_tokens')
    .where({access_token})

    var secret = '';
      const Jwtdecode = () => {
        try {
          return jwt.decode(access_token, secret, 'HS512');
        } catch (e) {
          console.log("err")
          return false;
        } 
      };

    if(db_at !== null){
      if(Jwtdecode() == false)
      {
        //console.log(Jwtdecode())
        return false
      }
        const res = Jwtdecode();
        console.log(res?.user_id,"user_id")

        const db_projects = await db('users_projects')
        .where({user_id:res?.user_id})

        if(db_projects !== null && db_projects.length !== 0){
          console.log(db_projects)
          const data = db_projects//[]?.project //jwt.decode(db_projects?.project, secret, 'HS512');
          //const nn = db_projects[0]?.project
          // const [data, setData] = useState(db_projects[0]?.project)
          // for (let index = 1; index < db_projects?.length; index++) {
          //   //console.log(db_projects[index]?.project, index)
          //   setData(data.concat(db_projects[index]?.project))
          //   console.log(data, index)
          // }
          //console.log(data)
          return data
        }else{
          return false
        }

      
    }
  }  async createProject(user_id, project){
    await db("project")
  }
    
}


module.exports = new userDAO();
