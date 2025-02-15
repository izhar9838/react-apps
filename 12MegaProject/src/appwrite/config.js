import { Client, ID,Databases,Storage, Query } from "appwrite";
import conf from '../conf/conf.js';

export classNameName DatabaseService{

    client=new Client();
    databases;
    bucket;
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId)
        this.databases=new Databases(this.client);
        this.bucket=new Storage(this.client);
    }
    async createPost({title,slug,content,featuredImage,userid,status}){
        try {
            return await this.databases.createDocument(conf.appwriteDatabaseId,conf.appwriteCollectionId,slug,{
                title,
                content,
                featuredImage,
                userid,
                status,
            })
        } catch (error) {
            throw error;
            
        }
    }
    async updatePost(slug,{title,content,featuredImage,status}){
        try {
            return await this.databases.updateDocument(conf.appwriteDatabaseId,conf.appwriteCollectionId,slug,{
                title,
                content,
                featuredImage,
                status,
            })
        } catch (error) {
            throw error;
            
        }
    }
    async deletePost({slug}){
        try {
             await this.databases.deleteDocument(conf.appwriteDatabaseId,conf.appwriteCollectionId,slug)
             return true;
        } catch (error) {
            console.log(error);
            return false;
            
            
        }
    }
    async getPost(slug){
        try {
            return await this.databases.getDocument(conf.appwriteDatabaseId,conf.appwriteCollectionId,slug)
        } catch (error) {
            console.log(error);
            
        }
    }
    async getPosts(queries =[Query.equal('status',"active")]){
        try {
            return await this.databases.listDocuments(conf.appwriteDatabaseId,conf.appwriteCollectionId,queries)
        } catch (error) {
            console.log(error);
            
        }
    }

    //file upload
    async uploadFile(file){
        try {
             await this.bucket.createFile(conf.appwriteBucketId,file);
             return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteFile(fileId){
        try {
             await this.bucket.deleteFile(conf.appwriteBucketId,fileId);
             return true;
        } catch (error) {
            console.log(error);
            return false;
            
        }
    }
    privewFile(fileId){
        return this.bucket.getFilePreview(conf.appwriteBucketId,fileId);
    }
}
const databaseService = new DatabaseService();
export default databaseService;