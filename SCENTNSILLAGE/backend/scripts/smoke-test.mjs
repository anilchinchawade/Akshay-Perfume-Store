const baseUrl = (process.env.API_BASE_URL || "http://localhost:5000/api/v1").replace(/\/+$/, "");

async function check(name, path, expectedStatuses, validate) {
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: { Accept: "application/json" }
    });
    let body = null;
    try {
      body = await response.json();
    } catch {
      // Non-JSON response is reported by the validation below.
    }

    const statusOk = expectedStatuses.includes(response.status);
    const bodyOk = validate ? validate(body) : true;

    if (!statusOk || !bodyOk) {
      console.error(`FAIL ${name}: HTTP ${response.status}`, body ?? "(no JSON body)");
      return false;
    }

    console.log(`PASS ${name}: HTTP ${response.status}`);
    return true;
  } catch (error) {
    console.error(`FAIL ${name}: ${error instanceof Error ? error.message : error}`);
    return false;
  }
}

const results = await Promise.all([
  check("Health endpoint", "/health", [200], body => body?.success === true),
  check("Public product catalogue", "/products?page=1&limit=5", [200], body => body?.success === true),
  check("Admin route requires authentication", "/admin/dashboard", [401, 403], body => body?.success === false)
]);

if (results.some(result => !result)) {
  console.error("\nSmoke test failed. Check that the backend and MongoDB are running.");
  process.exitCode = 1;
} else {
  console.log("\nAll smoke tests passed. This is a basic API check, not a full E2E or payment test.");
}
