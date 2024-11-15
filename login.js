// Google Login
window.onload = function() {
    google.accounts.id.initialize({
      client_id: 'YOUR_GOOGLE_CLIENT_ID',  // Ganti dengan Client ID Google Anda
      callback: handleGoogleCredentialResponse
    });
    google.accounts.id.renderButton(
      document.getElementById("google-button"),
      { theme: "outline", size: "large" }
    );
  };
  
  function handleGoogleCredentialResponse(response) {
    // Kirim ID token ke backend untuk diproses lebih lanjut
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
        clientId: 'YOUR_MICROSOFT_CLIENT_ID',  // Ganti dengan Client ID Microsoft Anda
        redirectUri: window.location.origin
      }
    };
    const msalInstance = new msal.PublicClientApplication(msalConfig);
    msalInstance.loginPopup().then(response => {
      // Kirim access token ke backend
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
      appId      : 'YOUR_FACEBOOK_APP_ID',  // Ganti dengan App ID Facebook Anda
      cookie     : true,
      xfbml      : true,
      version    : 'v10.0'
    });
  };
  
  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
  
  document.getElementById("facebook-button").onclick = function() {
    FB.login(function(response) {
      if (response.authResponse) {
        // Kirim access token ke backend
        fetch('/auth/facebook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: response.authResponse.accessToken })
        }).then(response => response.json())
          .then(data => console.log(data));
      }
    }, {scope: 'email'});
  };
  