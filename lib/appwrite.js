import { Client, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1') 
  .setProject('68f8eca50022e7d7ec23'); 

export const databases = new Databases(client);
