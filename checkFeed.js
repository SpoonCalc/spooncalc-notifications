import Parser from "rss-parser";
import fetch from "node-fetch";
import fs from "fs";

const parser = new Parser();

const EXPO_URL = "https://exp.host/--/api/v2/push/send";

const TOKENS = [
"ExponentPushToken[omntuFIgWhJCgYIwuvZXZb]"
];

async function sendNotification(title, body, url){

const messages = TOKENS.map(token => ({
to: token,
sound: "default",
title: title,
body: body,
data: { url }
}));

await fetch(EXPO_URL,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(messages)
});

}

async function checkFeed(){

const feed = await parser.parseURL("https://spooncalc.com/feed");

const latest = feed.items[0];

let lastPost = null;

if(fs.existsSync("lastPost.txt")){
lastPost = fs.readFileSync("lastPost.txt","utf8");
}

if(lastPost !== latest.link){

console.log("New article detected");

await sendNotification(
"New Recipe on SpoonCalc ☕",
latest.title,
latest.link
);

fs.writeFileSync("lastPost.txt",latest.link);

}else{

console.log("No new article");

}

}

checkFeed();
