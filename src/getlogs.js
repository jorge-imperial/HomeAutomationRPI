
// From https://docs.mongodb.com/realm/logs/api/


//WNSTNSIH 
//47564254-3a23-4878-886d-1113534abc19

async function authenticate(publicApiKey, privateApiKey) {
    const result = await context.http.post({
      url: `${ADMIN_API_BASE_URL}/auth/providers/mongodb-cloud/login`,
      headers: {
        "Content-Type": ["application/json"],
        "Accept": ["application/json"],
      },
      body: {
        "username": publicApiKey,
        "apiKey": privateApiKey,
      },
      encodeBodyAsJSON: true
    })
    return EJSON.parse(result.body.text());
  }
  
  function formatQueryString(queryParams) {
    const params = Object.entries(queryParams);
    return params.length > 0
      ? "?" + params.map(([a, b]) => `${a}=${b}`).join("&")
      : ""
  }

const ADMIN_API_BASE_URL = "https://realm.mongodb.com/api/admin/v3.0";
async function getlogs() {
  // Get values that you need for requests
  const projectId = "5b5622873b34b94c56444239" // /apps//logs"<Atlas Project ID>";
  const appId = "garden-oybkr";
  const publicApiKey = "WNSTNSIH";
  const privateApiKey = "47564254-3a23-4878-886d-1113534abc19";

  // Authenticate with the Atlas API Key
  const { access_token } = await authenticate(publicApiKey, privateApiKey);

  // Get logs for your Realm App
  const logsEndpoint = `${ADMIN_API_BASE_URL}/groups/${projectId}/apps/${appId}/logs`;
  const  request = {
    "url": logsEndpoint,
    "headers": {
      "Authorization": [`Bearer ${access_token}`]
    }
  };
  const result = await context.http.get(request);
  const logs = EJSON.parse(result.body.text());
  return logs;
}


logs = getlogs().catch(err => {
    console.error("Failed to get logs realm:", err)
});

console.log(logs);