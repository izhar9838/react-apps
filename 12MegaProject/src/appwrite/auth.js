import { Client, Account, ID } from "appwrite";
import conf from '../conf/conf.js';

export classNameName AuthService{
    client=new Client();
    account;
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId)
        this.account=new Account(this.client);
    }
    async createAccount({email,password,name}){
        try {
           const accountCreate=await this.account.create(ID.unique(),email,password,name);
           if (accountCreate) {
            //call another service
            this.login({email,password});
           } else {
            return accountCreate;
           }
            
        } catch (error) {
            throw error;
        }
    }
    async login({email,password}){
        try {
            return await this.account.createEmailPasswordSession(email,password);
            
        } catch (error) {
            throw error;
        }
    }
    async logout(){
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            throw error;
        }
    }
    async getAccount(){
        try {
            return await this.account.get();
        } catch (error) {
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;