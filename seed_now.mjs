const resp = await fetch("https://www.closetrush.in/api/admin/seed", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-seed-secret": "closerush_seed_bootstrap_2026"
  }
});
const data = await resp.json();
console.log(JSON.stringify(data, null, 2));
