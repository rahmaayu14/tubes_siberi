// Load the Google API client
const googleClientId = 'YOUR_GOOGLE_CLIENT_ID';
const microsoftClientId = 'YOUR_MICROSOFT_CLIENT_ID';
const facebookAppId = 'YOUR_FACEBOOK_APP_ID';

const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Berfungsi untuk menyajikan file statis
app.use(express.static(path.join(__dirname)));

// Rute untuk halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// Google Login
window.onload = function() {
  google.accounts.id.initialize({
    client_id: googleClientId,
    callback: handleGoogleCredentialResponse
  });
  google.accounts.id.renderButton(
    document.getElementById("google-button"),
    { theme: "outline", size: "large" }
  );
};

function handleGoogleCredentialResponse(response) {
  // Send ID token to backend
  fetch('/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_token: response.credential })
  }).then(response => response.json())
    .then(data => console.log(data));
}

// Microsoft Login
document.getElementById("microsoft-button").onclick = function() {
  const msalConfig = {
    auth: {
      clientId: microsoftClientId,
      redirectUri: window.location.origin
    }
  };
  const msalInstance = new msal.PublicClientApplication(msalConfig);
  msalInstance.loginPopup().then(response => {
    // Send access token to backend
    fetch('/auth/microsoft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: response.accessToken })
    }).then(response => response.json())
      .then(data => console.log(data));
  });
};

// Facebook Login
window.fbAsyncInit = function() {
  FB.init({
    appId      : facebookAppId,
    cookie     : true,
    xfbml      : true,
    version    : 'v10.0'
  });
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

document.getElementById("facebook-button").onclick = function() {
  FB.login(function(response) {
    if (response.authResponse) {
      // Send access token to backend
      fetch('/auth/facebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: response.authResponse.accessToken })
      }).then(response => response.json())
        .then(data => console.log(data));
    }
  }, {scope: 'email'});
};
