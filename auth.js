// types
const LoginResponse = {
  token: String
}


export async function login(userNameInput, passwordInput) {


  if (!userNameInput || !passwordInput) {
    errorMessage.textContent = "Please enter both user name and password.";
    return { ok: false };;
  }
  //connect to backend - 8800
  try {
    const response = await fetch("http://127.0.0.1:8800/api/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userName: userNameInput, password: passwordInput })
      });

    if (!response.ok) {
      if (response.status === 401) {
        errorMessage.textContent = "Invalid user name or password.";
      } else {
        errorMessage.textContent = "Login failed. Please try again.";
      }
      const data = await response.json();
      console.error("Login error:", data);
      return { ok: false };
    }
    
    return { ok: true, data };  
  
  } catch (error) {
    errorMessage.textContent = "Error. Please try again.";
    console.error("Network error:", error);
    return { ok: false } ;
  } finally {
    // Clear password field for security
    passwordInput.value = "";
  }
}


