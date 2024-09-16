// src/api.js

const API_BASE_URL = 'https://sandbox.transactworld.com/transactionServices/REST/v1'; 

export const getMerchantAuthToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/authToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'authentication.partnerId': process.env.AUTH_PARTNER_ID, 
        'merchant.username': process.env.PARTNER_USERNAME, 
        'authentication.sKey': process.env.MERCHANT_SECRET_KEY, 
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.result.description || 'Failed to fetch merchant auth token');
    }
  } catch (error) {
    console.error('Error fetching merchant auth token:', error);
    return null;
  }
};

export const getPartnerAuthToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/partnerAuthToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'authentication.partnerId': process.env.REACT_APP_PARTNER_ID,
        'partner.userName': process.env.REACT_APP_PARTNER_USERNAME,
        'authentication.sKey': process.env.REACT_APP_PARTNER_SECRET_KEY,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.result.description || 'Failed to fetch partner auth token');
    }
  } catch (error) {
    console.error('Error fetching partner auth token:', error);
    return null;
  }
};
