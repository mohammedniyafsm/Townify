import { google } from "googleapis";


const GoogleClientSecret=process.env.GoogleClientSecret||''
const GoogleClientId=process.env.GoogleClientId||''

const oAuthclient=new google.auth.OAuth2(
    GoogleClientId,
    GoogleClientSecret,
    'postmessage'
)

export {oAuthclient}