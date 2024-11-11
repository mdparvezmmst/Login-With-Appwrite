// src/appwriteConfig.js
import { Client } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
  .setProject('6729b7ff003370efe21b'); // Your project ID

export default client;
