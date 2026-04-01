const API_URL = "http://127.0.0.1:8800";

export async function login(userName, password) {
  if (!userName || !password)
    throw Error("Please enter both user name and password.");

  const response = await fetch(`${API_URL}/auth/token?ts=${Date.now()}`, {
    method: "GET",
    headers: {
      "Authorization": `Basic ${btoa(`${userName}:${password}`)}`
    },
  });

  if(!response.ok)
    throw Error(`Login failed: ${response.status} ${response.statusText}`);

  const resp = await response.json();
  if(!resp || typeof resp !== "object" || Array.isArray(resp))
    throw Error("Invalid response format");

  const { token } = resp;
  if(typeof token !== "string" || !token)
    throw Error("Invalid token");

  return token;
}
