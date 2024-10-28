const axios = require('axios');
const qs = require('qs');

const baseUrl = 'https://sandbox.safaricom.co.ke';
const shortcode = 'YOUR_SHORTCODE';
const lipaNaMpesaOnlineUrl = `${baseUrl}/mpesa/stkpush/v1/processrequest`;
const consumerKey = 'YOUR_CONSUMER_KEY';
const consumerSecret = 'YOUR_CONSUMER_SECRET';

const getAccessToken = async () => {
    const response = await axios.get(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        auth: {
            username: consumerKey,
            password: consumerSecret
        }
    });
    return response.data.access_token;
};

const initiatePayment = async (phoneNumber, amount) => {
    const accessToken = await getAccessToken();
    const payload = {
        "BusinessShortCode": shortcode,
        "Password": Buffer.from(`${shortcode}${passKey}${timestamp}`).toString('base64'),
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phoneNumber,
        "PartyB": shortcode,
        "PhoneNumber": phoneNumber,
        "CallBackURL": "https://yourcallbackurl.com/callback",
        "AccountReference": "YourAccountReference",
        "TransactionDesc": "Payment for services"
    };

    return await axios.post(lipaNaMpesaOnlineUrl, payload, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
};

module.exports = { initiatePayment };
