import {StreamChat} from 'stream-chat';
import "dotenv/config";

const apiKey=process.env.STREAM_API_KEY;
const apiSecret=process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret) {
    throw new Error("STREAM_API_KEY and STREAM_API_SECRET must be set in environment variables");
}

const streamClient=StreamChat.getInstance(apiKey, apiSecret);
export const upsertStreamUser = async (userData) => {
    try {
      if (!userData.id) {
        throw new Error("userData must have an id property");
      }
  
      await streamClient.upsertUsers([userData]);
      return userData;
    } catch (error) {
      console.error("Error creating/updating Stream user:", error);
      throw new Error("Failed to create or update Stream user");
    }
  };
  
  
export const generateStreamToken=async(userId)=>{
    try{
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    }catch(error){

    }
}